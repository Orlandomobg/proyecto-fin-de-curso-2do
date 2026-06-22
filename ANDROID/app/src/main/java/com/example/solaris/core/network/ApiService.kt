package com.example.solaris.core.network

import com.example.solaris.data.model.AnnualEnergyResponse
import com.example.solaris.data.model.EnergyConsumption
import com.example.solaris.data.model.EnergyConsumptionRequest
import com.example.solaris.data.model.FinancialResponse
import com.example.solaris.data.model.Panel
import com.example.solaris.data.model.ProductionResponse
import com.example.solaris.data.model.Property
import com.example.solaris.data.model.PropertyRequest
import com.example.solaris.data.model.RealtimeRequest
import com.example.solaris.data.model.RealtimeResponse
import com.example.solaris.data.model.RegisterUserRequest
import com.example.solaris.data.model.SolarResourceRequest
import com.example.solaris.data.model.SolarResourceResponse
import com.example.solaris.data.model.StudyRequest
import com.example.solaris.data.model.SystemDesignRequest
import com.example.solaris.data.model.SystemDesignResponse
import com.example.solaris.data.model.UpdateUserRequest
import com.example.solaris.data.model.User
import com.example.solaris.data.model.*
import retrofit2.http.*

interface ApiService {

    // ---------- Users ----------
    @POST("api/users")
    suspend fun registerUser(@Body body: RegisterUserRequest): User

    @GET("api/users/profile")
    suspend fun getProfile(): User

    @PUT("api/users/profile")
    suspend fun updateProfile(@Body body: UpdateUserRequest): User

    @DELETE("api/users/profile")
    suspend fun deleteProfile()

    // ---------- Properties ----------
    @POST("api/properties")
    suspend fun createProperty(@Body body: PropertyRequest): Property

    @GET("api/properties")
    suspend fun getProperties(): List<Property>

    @GET("api/properties/{id}")
    suspend fun getProperty(@Path("id") id: String): Property

    @PUT("api/properties/{id}")
    suspend fun updateProperty(@Path("id") id: String, @Body body: PropertyRequest): Property

    @DELETE("api/properties/{id}")
    suspend fun deleteProperty(@Path("id") id: String)

    // ---------- Panels ----------
    @GET("api/panels")
    suspend fun getPanels(): List<Panel>

    @GET("api/panels/{id}")
    suspend fun getPanel(@Path("id") id: String): Panel

    // ---------- Energy ----------
    @POST("api/energy-consumption")
    suspend fun createEnergy(@Body body: EnergyConsumptionRequest): EnergyConsumption

    @GET("api/energy-consumption")
    suspend fun getEnergyList(): List<EnergyConsumption>

    @GET("api/energy-consumption/property/{propertyId}")
    suspend fun getEnergyByProperty(@Path("propertyId") propertyId: String): List<EnergyConsumption>

    @GET("api/energy-consumption/property/{propertyId}/annual")
    suspend fun getAnnualEnergy(@Path("propertyId") propertyId: String): AnnualEnergyResponse

    // ---------- Solar / cálculo ----------
    @POST("api/solar/resource")
    suspend fun getSolarResource(@Body body: SolarResourceRequest): SolarResourceResponse

    @POST("api/solar/system-design")
    suspend fun getSystemDesign(@Body body: SystemDesignRequest): SystemDesignResponse

    @POST("api/solar/realtime")
    suspend fun getRealtimePrediction(@Body body: RealtimeRequest): RealtimeResponse

    @POST("api/production")
    suspend fun getProduction(@Body body: StudyRequest): ProductionResponse

    @POST("api/financial")
    suspend fun getFinancial(@Body body: StudyRequest): FinancialResponse
}