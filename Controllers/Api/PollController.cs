using AutoMapper;
using Ballotbox.Database;
using Ballotbox.Models;
using Ballotbox.ViewModels;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
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

        [Route("{userName}")]
        public async Task<JsonResult> Get(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            // todo
            //var results = Mapper.Map<IEnumerable<PollViewModel>>(_repository.GetAllPollsByUserId(user.Id));
            return Json(user);
        }


        [HttpPost]
        public async Task<JsonResult> Post([FromBody]AddPollViewModel vm)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var newPoll = Mapper.Map<Poll>(Mapper.Map<PollViewModel>(vm));
                    var user = await _userManager.FindByIdAsync(User.GetUserId());

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
    }
}
