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
            services.AddMvc()
                    .AddJsonOptions(opt =>
                    {
                        opt.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    });

            // Add framework services.
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
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
                try
                {
                    using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
                        .CreateScope())
                    {
                        serviceScope.ServiceProvider.GetService<BallotboxContext>()
                             .Database.Migrate();
                    }
                }
                catch { }
            }

            app.UseStaticFiles();

            app.UseIdentity();

            Mapper.Initialize(config =>
            {
                config.CreateMap<Poll, PollViewModel>().ReverseMap();
                config.CreateMap<Choice, ChoiceViewModel>().ReverseMap();
                config.CreateMap<Vote, VoteViewModel>().ReverseMap();
                config.CreateMap<BallotboxUser, BallotboxUserViewModel>().ReverseMap();
                config.CreateMap<AddPollViewModel, PollViewModel>()
                        .ForMember(dest => dest.Choices, opt => opt.MapFrom(src => src.Choices.Select(n => new Choice() { Name = n })));
            });

            // To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            
            var seeder = serviceProvider.GetService<BallotboxContextSeedData>();
            await seeder.EnsureSeedDataAsync();
        }
    }
}
