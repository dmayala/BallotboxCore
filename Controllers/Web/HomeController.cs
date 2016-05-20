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
            ViewData["IsLoggedIn"] = !String.IsNullOrEmpty(User.Identity.Name);
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
