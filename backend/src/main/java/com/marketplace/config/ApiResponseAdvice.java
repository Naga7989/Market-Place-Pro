package com.marketplace.config;

import com.marketplace.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        Class<?> paramType = returnType.getParameterType();
        return ApiResponse.class.isAssignableFrom(paramType) || 
               ResponseEntity.class.isAssignableFrom(paramType);
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request, ServerHttpResponse response) {
        if (body instanceof ApiResponse<?> apiResponse) {
            if (request instanceof ServletServerHttpRequest servletRequest) {
                HttpServletRequest httpServletRequest = servletRequest.getServletRequest();

                // 1. Populate path automatically if not set
                if (apiResponse.getPath() == null) {
                    apiResponse.setPath(httpServletRequest.getRequestURI());
                }

                // 2. Populate statusCode automatically if not set
                if (apiResponse.getStatusCode() == null) {
                    if (response instanceof ServletServerHttpResponse servletResponse) {
                        apiResponse.setStatusCode(servletResponse.getServletResponse().getStatus());
                    } else {
                        apiResponse.setStatusCode(200); // fallback
                    }
                }

                // 3. Populate executionTimeMs if start time attribute exists
                Long startTime = (Long) httpServletRequest.getAttribute("api_start_time");
                if (startTime != null) {
                    apiResponse.setExecutionTimeMs(System.currentTimeMillis() - startTime);
                }
            }
        }
        return body;
    }
}
