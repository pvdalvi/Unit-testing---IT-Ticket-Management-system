namespace ITTicketing.Backend.DTOs
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public bool Success { get; set; } = true;
        public string? Message { get; set; }
        public List<string>? Errors { get; set; }
        public int StatusCode { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Request successful.", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Data = data,
                Success = true,
                Message = message,
                StatusCode = statusCode,
                Errors = null
            };
        }

        public static ApiResponse<T> ErrorResponse(string message, int statusCode, List<string>? errors = null)
        {
            return new ApiResponse<T>
            {
                Data = default,
                Success = false,
                Message = message,
                StatusCode = statusCode,
                Errors = errors ?? new List<string>()
            };
        }
    }
}