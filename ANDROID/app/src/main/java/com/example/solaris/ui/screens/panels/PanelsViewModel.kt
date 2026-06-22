package com.example.solaris.ui.screens.panels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.solaris.core.network.UiState
import com.example.solaris.data.model.Panel
import com.example.solaris.data.repository.PanelRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PanelsViewModel(
    private val repository: PanelRepository = PanelRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState<List<Panel>>>(UiState.Loading)
    val uiState: StateFlow<UiState<List<Panel>>> = _uiState.asStateFlow()

    init {
        loadPanels()
    }

    fun loadPanels() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val panels = repository.getPanels()
                _uiState.value = UiState.Success(panels)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Error desconocido")
            }
        }
    }
}