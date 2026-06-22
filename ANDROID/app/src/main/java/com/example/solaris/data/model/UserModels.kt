package com.example.solaris.data.model

data class User(
    val id: String,
    val firebase_uid: String,
    val email: String,
    val name: String?,
    val role: String,
    val created_at: String
)

data class RegisterUserRequest(val name: String)
data class UpdateUserRequest(val name: String?, val email: String?)