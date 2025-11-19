using ITTicketing.Backend.Data;
using ITTicketing.Backend.DTOs;
using ITTicketing.Backend.Models;
using Microsoft.EntityFrameworkCore;
namespace ITTicketing.Backend.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(int userId);
        Task<IEnumerable<UserResponseDto>> GetUsersByRoleAsync(string roleCode);
        Task<IEnumerable<UserResponseDto>> GetUsersByDepartmentAsync(string department);
        Task<IEnumerable<UserResponseDto>> GetManagersAsync();
        Task<IEnumerable<UserResponseDto>> GetITPersonnelAsync();
    }

    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all users with their roles
        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => MapToResponseDto(u)).ToList();
        }

        // Get single user by ID
        public async Task<UserResponseDto?> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null) return null;

            return MapToResponseDto(user);
        }

        // Get users by role code (e.g., all IT_PERSON)
        public async Task<IEnumerable<UserResponseDto>> GetUsersByRoleAsync(string roleCode)
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role!.RoleCode == roleCode.ToUpper())
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => MapToResponseDto(u)).ToList();
        }

        // Get users by department
        public async Task<IEnumerable<UserResponseDto>> GetUsersByDepartmentAsync(string department)
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Department == department)
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => MapToResponseDto(u)).ToList();
        }

        // Get all managers (L1, L2, COO)
        public async Task<IEnumerable<UserResponseDto>> GetManagersAsync()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role!.RoleCode == "L1_MANAGER"
                    || u.Role.RoleCode == "L2_HEAD"
                    || u.Role.RoleCode == "COO")
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => MapToResponseDto(u)).ToList();
        }

        // Get all IT personnel
        public async Task<IEnumerable<UserResponseDto>> GetITPersonnelAsync()
        {
            var users = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Role!.RoleCode == "IT_PERSON")
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return users.Select(u => MapToResponseDto(u)).ToList();
        }

        // Helper method to map User to UserResponseDto
        private UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                UserId = user.UserId,
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Department = user.Department,
                RoleCode = user.Role?.RoleCode ?? "UNKNOWN",
                RoleName = user.Role?.RoleCode ?? "Unknown",
                ManagerId = user.ManagerId
            };
        }
    }
}