using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Biruk",
                    Email = "biras7070@gmail.com",
                    UserName = "biras",
                    Address = new Address
                    {
                        FirstName = "Biruk",
                        LastName = "Wolde",
                        Street = "Churchill Street",
                        City = "Addis Abeba",
                        State = "AA",
                        Zipcode = "10256"
                    }
                };

                await userManager.CreateAsync(user, "P@$$w0rd");
            }
        }
    }
}
