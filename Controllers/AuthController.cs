﻿using Ballotbox.Models;
using Ballotbox.ViewModels;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Ballotbox.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<BallotboxUser> _userManager;
        private readonly SignInManager<BallotboxUser> _signInManager;
        private readonly ILogger _logger;

        public AuthController(
            UserManager<BallotboxUser> userManager,
            SignInManager<BallotboxUser> signInManager,
            ILoggerFactory loggerFactory)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AuthController>();
        }

        [HttpPost]
        public async Task<JsonResult> Login([FromBody] LoginViewModel model)
        {
             if (ModelState.IsValid)
             {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation(1, "User logged in.");
                    return Json(new { Username = model.Username });
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                }
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "Failed", ModelState = ModelState.Values.SelectMany(v => v.Errors) });
        }
        
        [HttpPost]
        public async Task<ActionResult> Logout()
        {
            if (User.Identity.IsAuthenticated)
            {
                await _signInManager.SignOutAsync();
            }

            return Json(new {});
        }
    }
}
