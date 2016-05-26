using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Ballotbox.Controllers.Web
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewData["username"] = User.Identity.Name;
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
