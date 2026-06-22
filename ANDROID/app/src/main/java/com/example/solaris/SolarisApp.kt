package com.example.solaris

import android.app.Application
import com.google.firebase.auth.FirebaseAuth
import com.example.solaris.core.network.TokenManager
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class SolarisApp : Application() {

    override fun onCreate() {
        super.onCreate()

        FirebaseAuth.getInstance().addIdTokenListener { firebaseAuth: FirebaseAuth ->
            val user = firebaseAuth.currentUser
            if (user == null) {
                TokenManager.clear()
            } else {
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val result = user.getIdToken(false).await()
                        TokenManager.currentToken = result.token
                    } catch (e: Exception) {
                        TokenManager.clear()
                    }
                }
            }
        }
    }
}