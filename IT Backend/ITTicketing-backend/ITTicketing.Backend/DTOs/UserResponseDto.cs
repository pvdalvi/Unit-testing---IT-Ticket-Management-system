namespace ITTicketing.Backend.DTOs
{
    public class UserResponseDto
    {
        public int UserId { get; set; }
        public required string Username { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? Department { get; set; }
        public required string RoleCode { get; set; }
        public required string RoleName { get; set; }
        public int? ManagerId { get; set; }
    }
}