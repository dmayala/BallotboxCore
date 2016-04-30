using Ballotbox.Database;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
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

        [HttpGet("")]
        public JsonResult Get()
        {
            var results = _repository.GetAllPolls();
            return Json(results);
        }

    }
}
