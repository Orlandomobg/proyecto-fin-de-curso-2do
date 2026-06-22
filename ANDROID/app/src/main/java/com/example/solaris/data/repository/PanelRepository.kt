package com.example.solaris.data.repository

import com.example.solaris.core.network.ApiClient
import com.example.solaris.data.model.Panel

/** Aísla el ViewModel de los detalles de Retrofit. */
class PanelRepository {
    suspend fun getPanels(): List<Panel> {
        return ApiClient.api.getPanels()
    }

    suspend fun getPanel(id: String): Panel {
        return ApiClient.api.getPanel(id)
    }
}