package com.example.solaris.data.repository

import com.example.solaris.core.network.ApiClient
import com.example.solaris.core.network.TokenManager
import com.example.solaris.data.model.RegisterUserRequest
import com.example.solaris.data.model.User
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.tasks.await

class AuthRepository(
    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()
) {
    val currentFirebaseUser get() = firebaseAuth.currentUser

    /** Login. Si el token llega bien, TokenManager se actualiza solo (listener en SolarisApp). */
    suspend fun login(email: String, password: String) {
        firebaseAuth.signInWithEmailAndPassword(email, password).await()
    }

    /** Registro en Firebase + alta del perfil en Postgres. */
    suspend fun register(email: String, password: String, name: String): User {
        val result = firebaseAuth.createUserWithEmailAndPassword(email, password).await()

        // Aseguramos que el token ya está disponible antes de llamar a nuestro back
        val token = result.user?.getIdToken(false)?.await()?.token
        TokenManager.currentToken = token

        return ApiClient.api.registerUser(RegisterUserRequest(name = name))
    }

    fun logout() {
        firebaseAuth.signOut()
        TokenManager.clear()
    }
}