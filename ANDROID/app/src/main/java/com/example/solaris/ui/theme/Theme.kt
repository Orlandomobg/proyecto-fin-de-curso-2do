package com.example.solaris.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val SolarisColorScheme = darkColorScheme(
    primary = SolarYellow,
    onPrimary = Color.Black.copy(alpha = 1f).let { androidx.compose.ui.graphics.Color.Black },
    secondary = SolarYellowDark,
    background = BackgroundDark,
    surface = SurfaceDark,
    surfaceVariant = SurfaceVariantDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    error = ErrorRed
)

@Composable
fun SolarisTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = SolarisColorScheme,
        typography = SolarisTypography,
        content = content
    )
}