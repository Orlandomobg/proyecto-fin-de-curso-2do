package com.example.solaris.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.solaris.ui.screens.auth.LoginScreen
import com.example.solaris.ui.screens.auth.RegisterScreen
import com.example.solaris.ui.screens.panels.PanelsScreen
import com.example.solaris.ui.screens.properties.LocationPickerScreen
import com.google.firebase.auth.FirebaseAuth

object Routes {
    const val LOGIN = "login"
    const val REGISTER = "register"
    const val HOME = "home" // de momento muestra PanelsScreen; en Fase 2 será el dashboard real

    const val MAP_TEST = "map_test" // temporal, solo para validar el mapa
}

@Composable
fun SolarisNavGraph(navController: NavHostController = rememberNavController()) {
    val startDestination = if (FirebaseAuth.getInstance().currentUser != null) Routes.HOME else Routes.LOGIN

    NavHost(navController = navController, startDestination = startDestination) {

        composable(Routes.LOGIN) {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
                onGoToRegister = { navController.navigate(Routes.REGISTER) }
            )
        }

        composable(Routes.REGISTER) {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate(Routes.HOME) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
                onGoToLogin = { navController.popBackStack() }
            )
        }

        composable(Routes.HOME) {
            Column(modifier = androidx.compose.ui.Modifier.fillMaxSize()) {
                Button(
                    onClick = { navController.navigate(Routes.MAP_TEST) },
                    modifier = androidx.compose.ui.Modifier.padding(16.dp)
                ) {
                    Text("Probar selector de mapa")
                }
                Box(modifier = androidx.compose.ui.Modifier.weight(1f)) {
                    PanelsScreen()
                }
            }
        }

        composable(Routes.MAP_TEST) {
            LocationPickerScreen(
                onLocationConfirmed = { lat, lon ->
                    // de momento solo volvemos atrás; en Fase 2B esto rellenará el form real
                    navController.popBackStack()
                }
            )
        }
    }
}