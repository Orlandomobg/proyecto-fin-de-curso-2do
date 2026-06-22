package com.example.solaris.ui.screens.properties

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@Composable
fun LocationPickerScreen(
    initialLat: Double = 40.4168,
    initialLon: Double = -3.7038,
    onLocationConfirmed: (lat: Double, lon: Double) -> Unit
) {
    var latText by remember { mutableStateOf(initialLat.toString()) }
    var lonText by remember { mutableStateOf(initialLon.toString()) }
    var error by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text("Ubicación de la propiedad", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        Text(
            "Introduce las coordenadas. Puedes obtenerlas buscando tu dirección en Google Maps " +
                    "y copiando lat/lon desde la URL.",
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(Modifier.height(24.dp))

        OutlinedTextField(
            value = latText,
            onValueChange = { latText = it; error = null },
            label = { Text("Latitud") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(
            value = lonText,
            onValueChange = { lonText = it; error = null },
            label = { Text("Longitud") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )

        if (error != null) {
            Spacer(Modifier.height(8.dp))
            Text(error!!, color = MaterialTheme.colorScheme.error)
        }

        Spacer(Modifier.height(24.dp))

        Button(
            onClick = {
                val lat = latText.toDoubleOrNull()
                val lon = lonText.toDoubleOrNull()
                when {
                    lat == null || lon == null -> error = "Introduce números válidos"
                    lat < -90 || lat > 90 -> error = "Latitud fuera de rango (-90 a 90)"
                    lon < -180 || lon > 180 -> error = "Longitud fuera de rango (-180 a 180)"
                    else -> onLocationConfirmed(lat, lon)
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Confirmar ubicación")
        }
    }
}