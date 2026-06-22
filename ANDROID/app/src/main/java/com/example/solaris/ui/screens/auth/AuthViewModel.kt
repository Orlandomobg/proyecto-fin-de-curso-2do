package com.example.solaris.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.solaris.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class AuthUiState {
    object Idle : AuthUiState()
    object Loading : AuthUiState()
    object Success : AuthUiState()
    data class Error(val message: String) : AuthUiState()
}

class AuthViewModel(
    private val repository: AuthRepository = AuthRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow<AuthUiState>(AuthUiState.Idle)
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        if (email.isBlank() || password.isBlank()) {
            _uiState.value = AuthUiState.Error("Rellena email y contraseña")
            return
        }
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            try {
                repository.login(email, password)
                _uiState.value = AuthUiState.Success
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(mapFirebaseError(e))
            }
        }
    }

    fun register(email: String, password: String, name: String) {
        if (email.isBlank() || password.isBlank() || name.isBlank()) {
            _uiState.value = AuthUiState.Error("Rellena todos los campos")
            return
        }
        if (password.length < 6) {
            _uiState.value = AuthUiState.Error("La contraseña debe tener al menos 6 caracteres")
            return
        }
        viewModelScope.launch {
            _uiState.value = AuthUiState.Loading
            try {
                repository.register(email, password, name)
                _uiState.value = AuthUiState.Success
            } catch (e: Exception) {
                _uiState.value = AuthUiState.Error(mapFirebaseError(e))
            }
        }
    }

    fun resetState() {
        _uiState.value = AuthUiState.Idle
    }

    private fun mapFirebaseError(e: Exception): String {
        val msg = e.message ?: return "Error desconocido"
        return when {
            msg.contains("INVALID_LOGIN_CREDENTIALS") || msg.contains("password is invalid") -> "Email o contraseña incorrectos"
            msg.contains("EMAIL_EXISTS") -> "Ese email ya está registrado"
            msg.contains("badly formatted") -> "Email no válido"
            msg.contains("network", ignoreCase = true) -> "Sin conexión con el servidor"
            else -> msg
        }
    }
}