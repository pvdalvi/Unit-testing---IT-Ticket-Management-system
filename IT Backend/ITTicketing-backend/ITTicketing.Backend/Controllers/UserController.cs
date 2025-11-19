using ITTicketing.Backend.DTOs;
using ITTicketing.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace ITTicketing.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Get all users in the system
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(users, "Users retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching users.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get a single user by ID
        /// </summary>
        [HttpGet("{userId:int}")]
        [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserById(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Invalid user ID.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var user = await _userService.GetUserByIdAsync(userId);

                if (user == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse($"User with ID {userId} not found.", StatusCodes.Status404NotFound));
                }

                return Ok(ApiResponse<UserResponseDto>.SuccessResponse(user));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching user.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get all users by role code (e.g., IT_PERSON, L1_MANAGER, EMPLOYEE)
        /// </summary>
        [HttpGet("by-role/{roleCode}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUsersByRole(string roleCode)
        {
            if (string.IsNullOrWhiteSpace(roleCode))
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Role code is required.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var users = await _userService.GetUsersByRoleAsync(roleCode);
                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(users, $"Users with role {roleCode} retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching users by role.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get all users by department
        /// </summary>
        [HttpGet("by-department/{department}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponseDto>>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUsersByDepartment(string department)
        {
            if (string.IsNullOrWhiteSpace(department))
            {
                return BadRequest(ApiResponse<object>.ErrorResponse("Department is required.", StatusCodes.Status400BadRequest));
            }

            try
            {
                var users = await _userService.GetUsersByDepartmentAsync(department);
                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(users, $"Users in {department} retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching users by department.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get all managers (L1_MANAGER, L2_HEAD, COO)
        /// </summary>
        [HttpGet("managers")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetManagers()
        {
            try
            {
                var managers = await _userService.GetManagersAsync();
                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(managers, "All managers retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching managers.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }

        /// <summary>
        /// Get all IT personnel
        /// </summary>
        [HttpGet("it-personnel")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<UserResponseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetITPersonnel()
        {
            try
            {
                var itPersonnel = await _userService.GetITPersonnelAsync();
                return Ok(ApiResponse<IEnumerable<UserResponseDto>>.SuccessResponse(itPersonnel, "All IT personnel retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ApiResponse<object>.ErrorResponse("Error fetching IT personnel.", StatusCodes.Status500InternalServerError, new List<string> { ex.Message }));
            }
        }
    }
}