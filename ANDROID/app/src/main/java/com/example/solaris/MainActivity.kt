package com.example.solaris

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.solaris.ui.navigation.SolarisNavGraph
import com.example.solaris.ui.theme.SolarisTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SolarisTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    SolarisNavGraph()
                }
            }
        }
    }
}