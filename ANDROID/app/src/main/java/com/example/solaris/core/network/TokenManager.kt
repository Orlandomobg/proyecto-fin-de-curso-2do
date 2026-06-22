package com.example.solaris.core.network

/** Guarda en memoria el ID token de Firebase actual, para que el interceptor lo use. */
object TokenManager {
    @Volatile
    var currentToken: String? = null

    fun clear() {
        currentToken = null
    }
}