using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ballotbox.Models;
using Ballotbox.Database;
using Ballotbox.Services;
using Newtonsoft.Json.Serialization;
using Ballotbox.ViewModels;
using Microsoft.EntityFrameworkCore.Infrastructure;
using AutoMapper;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.NodeServices;

namespace Ballotbox
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Set up configuration sources.
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddJsonFile("config.json", optional : true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public static IConfigurationRoot Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddNodeServices();
            services.AddMvc()
                    .AddJsonOptions(opt =>
                    {
                        opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    });

            services.AddEntityFrameworkNpgsql()
                .AddDbContext<BallotboxContext>(options => 
                    options.UseNpgsql(Configuration["Data:BallotboxContextConnection"]));

            services.AddIdentity<BallotboxUser, IdentityRole>()
                .AddEntityFrameworkStores<BallotboxContext>()
                .AddDefaultTokenProviders();

            services.AddTransient<BallotboxContextSeedData>();
            services.AddScoped<IBallotboxRepository, BallotboxRepository>();
            
            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IServiceProvider serviceProvider, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseDeveloperExceptionPage();

            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true,
                    ReactHotModuleReplacement = true
                });
            }

            Mapper.Initialize(config =>
            {
                config.CreateMap<Poll, PollViewModel>().ReverseMap();
                config.CreateMap<Choice, ChoiceViewModel>().ReverseMap();
                config.CreateMap<Vote, VoteViewModel>().ReverseMap();
                config.CreateMap<BallotboxUser, BallotboxUserViewModel>().ReverseMap();
                config.CreateMap<AddPollViewModel, PollViewModel>()
                        .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices.Select(n => new Choice() { Name = n })));
            });

            app.UseStaticFiles();     
            app.UseIdentity();
            loggerFactory.AddConsole();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            var seeder = serviceProvider.GetService<BallotboxContextSeedData>();
            await seeder.EnsureSeedDataAsync();
        }
    }
}
