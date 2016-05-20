using AutoMapper;
using Ballotbox.Database;
using Ballotbox.Models;
using Ballotbox.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace Ballotbox.Controllers.Api
{
    [Authorize]
    [Route("/api/polls")]
    public class PollController : Controller
    {
        private ILogger<PollController> _logger;
        private IBallotboxRepository _repository;
        private UserManager<BallotboxUser> _userManager;

        public PollController(IBallotboxRepository repository, ILogger<PollController> logger, UserManager<BallotboxUser> userManager)
        {
            _repository = repository;
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet]
        public JsonResult Get()
        {
            var results = Mapper.Map<IEnumerable<PollViewModel>>(_repository.GetAllPolls());
            return Json(results);
        }

        [HttpGet]
        [Route("user/{userName}")]
        public async Task<JsonResult> GetUserPolls(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user != null)
            {
                var polls = _repository.GetAllPollsByUserId(user.Id);

                if (polls != null)
                {
                    var results = Mapper.Map<IEnumerable<PollViewModel>>(polls);
                    return Json(results);
                }

            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed" });
        }

        [HttpGet]
        [Route("{pollId}")]
        public JsonResult GetPollById(int pollId) {
            var poll = _repository.GetPollById(pollId);
            
            if (poll != null) { 
                var result = Mapper.Map<PollViewModel>(_repository.GetPollById(pollId));
                return Json(result);
            }
          
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed" });
        }

        [HttpPost]
        public async Task<JsonResult> Post([FromBody]AddPollViewModel vm)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var newPoll = Mapper.Map<Poll>(Mapper.Map<PollViewModel>(vm));
                    var user = await _userManager.FindByIdAsync(_userManager.GetUserId(User));

                    newPoll.User = user;

                    // Save to the Database
                    _logger.LogInformation("Attempting to save a new poll");
                    _repository.AddPoll(newPoll);

                    if (_repository.SaveAll())
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(Mapper.Map<PollViewModel>(newPoll));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError("Failed to save new poll", ex);
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = ex.Message });
                }
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }

        [HttpDelete]
        [Route("{pollId}")]
        public JsonResult Delete(int pollId)
        {
            _repository.RemovePollById(pollId);
            if (_repository.SaveAll())
            {
                return Json(new { Id = pollId });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }
        
        [HttpPost]
        [Route("{pollId}/choices/{choiceId}")]
        public async Task<JsonResult> Vote(int choiceId) {
            var newVote = new Vote();
            
            var user = await _userManager.FindByIdAsync(_userManager.GetUserId(User));
            newVote.User = user;
            
            _repository.AddVote(choiceId, newVote);
            if (_repository.SaveAll()){
                return Json(new { ChoiceId = choiceId });
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState });     
        }
    } 
}
