package com.example.solaris.core.network

import okhttp3.Interceptor
import okhttp3.Response

/** Añade el Bearer token a cada request, si hay uno disponible. */
class AuthInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = TokenManager.currentToken

        val request = if (token != null) {
            original.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            original
        }

        return chain.proceed(request)
    }
}