package com.example.solaris.ui.screens.panels

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.solaris.core.network.UiState

@Composable
fun PanelsScreen(viewModel: PanelsViewModel = androidx.lifecycle.viewmodel.compose.viewModel()) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Catálogo de paneles", style = MaterialTheme.typography.titleLarge)
        Spacer(modifier = Modifier.height(16.dp))

        when (val s = state) {
            is UiState.Loading -> CircularProgressIndicator()
            is UiState.Error -> Text("Error: ${s.message}")
            is UiState.Success -> {
                if (s.data.isEmpty()) {
                    Text("Sin paneles")
                } else {
                    LazyColumn {
                        items(s.data) { panel ->
                            Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("${panel.brand} ${panel.model}", style = MaterialTheme.typography.titleMedium)
                                    Text("${panel.power_watt} W · ${panel.efficiency_percentage}% eficiencia")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}