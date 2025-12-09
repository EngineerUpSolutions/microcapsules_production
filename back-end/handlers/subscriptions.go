package handlers

import (
	"net/http"
	"strconv"

	"microcapsules-backend/internal/subscriptions"

	"github.com/gin-gonic/gin"
)

type SubscriptionHandler struct {
	Repo *subscriptions.Repository
}

func NewSubscriptionHandler(repo *subscriptions.Repository) *SubscriptionHandler {
	return &SubscriptionHandler{Repo: repo}
}

// RegisterRoutes registers GET + POST on the Gin router.
func (h *SubscriptionHandler) RegisterRoutes(r *gin.Engine) {
	r.GET("/api/v1/distribution/subscriptions", h.GetUserSubscriptions)
	r.POST("/api/v1/distribution/subscriptions", h.UpdateSubscription)
}

type updateSubscriptionRequest struct {
	UserID    string `json:"userId"`
	CourseID  string `json:"courseId"`
	Subscribe bool   `json:"subscribe"`
}

// GET /api/v1/distribution/subscriptions?user_id=175878
func (h *SubscriptionHandler) GetUserSubscriptions(c *gin.Context) {
	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id es requerido"})
		return
	}

	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id inválido"})
		return
	}

	subs, err := h.Repo.GetByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error consultando suscripciones"})
		return
	}

	type item struct {
		CourseID   int64 `json:"courseId"`
		Subscribed bool  `json:"subscribed"`
	}

	resp := make([]item, 0, len(subs))
	for _, s := range subs {
		resp = append(resp, item{
			CourseID:   s.CourseID,
			Subscribed: s.Subscribed,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"subscriptions": resp,
	})
}

// POST /api/v1/distribution/subscriptions
// Body: { "userId": "175878", "courseId": "10144", "subscribe": true }
func (h *SubscriptionHandler) UpdateSubscription(c *gin.Context) {
	var req updateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "JSON inválido"})
		return
	}

	if req.UserID == "" || req.CourseID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId y courseId son requeridos"})
		return
	}

	userID, err := strconv.ParseInt(req.UserID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId inválido"})
		return
	}

	courseID, err := strconv.ParseInt(req.CourseID, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "courseId inválido"})
		return
	}

	if err := h.Repo.Upsert(userID, courseID, req.Subscribe); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo guardar la suscripción"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

