
using ITTicketing.Backend.Data;
using ITTicketing.Backend.Services;
using Microsoft.EntityFrameworkCore;

namespace ITTicketing.Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultContext"));
            });

            builder.Services.AddScoped<ITicketService, TicketService>();
            builder.Services.AddScoped<IUserService, UserService>();
            // Add controllers service registration (MUST be included to find your controllers)
            builder.Services.AddControllers();
            // Add services to the container.
            builder.Services.AddAuthorization();

            const string MyReactPolicy = "_myReactPolicy";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: MyReactPolicy,
                                  policy =>
                                  {
                                      policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod()
                                            .AllowCredentials();
                                  });
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseRouting();
            app.UseHttpsRedirection();
            app.UseCors(MyReactPolicy);

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
