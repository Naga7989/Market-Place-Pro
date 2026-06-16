package com.marketplace.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Integer statusCode;
    private String path;
    private Map<String, String> errors;
    private Long executionTimeMs;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "UTC")
    @Builder.Default
    private Instant timestamp = Instant.now();

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message("Success")
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, int statusCode, String path) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .statusCode(statusCode)
                .path(path)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, int statusCode, String path, Map<String, String> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .statusCode(statusCode)
                .path(path)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }
}
