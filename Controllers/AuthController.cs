using Ballotbox.Models;
using Ballotbox.Token;
using Ballotbox.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;

namespace Ballotbox.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<BallotboxUser> _userManager;
        private readonly SignInManager<BallotboxUser> _signInManager;
        private readonly ILogger _logger;
        private readonly TokenAuthOptions _tokenOptions;

        public AuthController(
            UserManager<BallotboxUser> userManager,
            SignInManager<BallotboxUser> signInManager,
            ILoggerFactory loggerFactory,
            TokenAuthOptions tokenOptions)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AuthController>();
            _tokenOptions = tokenOptions;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (await _userManager.FindByEmailAsync(model.Email) != null)
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json(new { Message = "This email is associated with another account." });
                }

                var user = new BallotboxUser() { UserName = model.Username, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    _logger.LogInformation(3, "User created a new account with password.");
                    return Json(new { Username = user.UserName });
                }
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json(new { Message = "This username is already taken." });

        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
             if (ModelState.IsValid)
             {
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    _logger.LogInformation(1, "User logged in.");
                    var user = await _userManager.FindByNameAsync(model.Username);
                    DateTime? expires = DateTime.UtcNow.AddDays(30);
                    var token = GetToken(user, expires);
                    return Json(new { Username = user.UserName, Token = token });
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
        public async Task<IActionResult> Logout()
        {
            if (User.Identity.IsAuthenticated)
            {
                await _signInManager.SignOutAsync();
            }

            return Json(new {});
        }

        private string GetToken(IdentityUser user, DateTime? expires)
        {
            var handler = new JwtSecurityTokenHandler();

            var identity = new ClaimsIdentity(new GenericIdentity(user.UserName, "TokenAuth"),
                new[] { new Claim(ClaimTypes.NameIdentifier, user.Id) });

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor()
            {
                Issuer = _tokenOptions.Issuer,
                Audience = _tokenOptions.Audience,
                SigningCredentials = _tokenOptions.SigningCredentials,
                Subject = identity,
                Expires = expires
            });
            return handler.WriteToken(securityToken);
        }
    }
}
