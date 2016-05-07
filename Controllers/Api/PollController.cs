using AutoMapper;
using Ballotbox.Database;
using Ballotbox.Models;
using Ballotbox.ViewModels;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Ballotbox.Controllers.Api
{
    [Route("/api/polls")]
    public class PollController : Controller
    {
        private ILogger<PollController> _logger;
        private IBallotboxRepository _repository;

        public PollController(IBallotboxRepository repository, ILogger<PollController> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        [HttpGet]
        public JsonResult Get()
        {
            var results = _repository.GetAllPolls();
            return Json(results);
        }

        [HttpPost]
        public JsonResult Post([FromBody]AddPollViewModel vm)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var vm2 = new PollViewModel() { Name = vm.Name, Choices = vm.Choices.Select(n => new Choice() { Name = n }) };
                    var newPoll = Mapper.Map<Poll>(vm2);

                    // Save to the Database
                    _logger.LogInformation("Attempting to save a new trip");
                    _repository.AddPoll(newPoll);

                    if (_repository.SaveAll())
                    {
                        Response.StatusCode = (int)HttpStatusCode.Created;
                        return Json(Mapper.Map<PollViewModel>(newPoll));
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError("Failed to save new trip", ex);
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = ex.Message });
                }
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState });
        }
    }
}
