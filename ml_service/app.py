from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = os.getenv('MODEL_PATH', './model.pkl')

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"⚠️  Model not found at {MODEL_PATH}. Please run train_model.py first.")
    model = None

# Performance level mapping
PERFORMANCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

# Recommendation templates
RECOMMENDATIONS = {
    'Beginner': {
        'low_score': "Focus on building strong fundamentals. Review basic concepts and practice regularly.",
        'low_diversity': "Try exploring different topics to broaden your knowledge base.",
        'default': "Keep practicing! Consistency is key to improvement. Start with easier topics and gradually increase difficulty."
    },
    'Intermediate': {
        'improving': "Great progress! Keep up the momentum and tackle more challenging topics.",
        'stagnant': "You're doing well overall. Try varying your study topics or increasing difficulty to keep improving.",
        'default': "You have a solid foundation. Focus on mastering advanced concepts in your weaker areas."
    },
    'Advanced': {
        'high_diversity': "Excellent work! Consider mentoring others or contributing to learning communities.",
        'specialized': "You excel in your focus areas. Consider exploring related advanced topics or teaching others.",
        'default': "Outstanding performance! Challenge yourself with expert-level content or real-world projects."
    }
}

def generate_recommendation(performance_level, avg_score, topic_diversity, recent_improvement):
    """Generate personalized recommendation based on user metrics"""
    recommendations = RECOMMENDATIONS.get(performance_level, RECOMMENDATIONS['Beginner'])
    
    if performance_level == 'Beginner':
        if avg_score < 50:
            return recommendations['low_score']
        elif topic_diversity < 0.3:
            return recommendations['low_diversity']
        else:
            return recommendations['default']
    
    elif performance_level == 'Intermediate':
        if recent_improvement > 10:
            return recommendations['improving']
        elif abs(recent_improvement) < 5:
            return recommendations['stagnant']
        else:
            return recommendations['default']
    
    else:  # Advanced
        if topic_diversity >= 0.6:
            return recommendations['high_diversity']
        elif topic_diversity < 0.4:
            return recommendations['specialized']
        else:
            return recommendations['default']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'ML Service is running',
        'model_loaded': model is not None
    })

@app.route('/analyze', methods=['POST'])
def analyze_progress():
    """Analyze student progress and return recommendations"""
    try:
        if model is None:
            # Fallback to rule-based analysis
            return rule_based_analysis(request.json)
        
        data = request.json
        
        # Extract features in the same order as training
        features = np.array([[
            data.get('avg_score', 0),
            data.get('time_spent', 0),
            data.get('completion_rate', 0),
            data.get('topic_diversity', 0),
            data.get('recent_improvement', 0)
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        performance_level = PERFORMANCE_LEVELS[prediction]
        
        # Generate personalized recommendation
        recommendation = generate_recommendation(
            performance_level,
            data.get('avg_score', 0),
            data.get('topic_diversity', 0),
            data.get('recent_improvement', 0)
        )
        
        return jsonify({
            'performance_level': performance_level,
            'recommendation': recommendation,
            'confidence': 'high' if model else 'medium'
        })
    
    except Exception as e:
        print(f"Error in analysis: {str(e)}")
        return jsonify({
            'error': 'Analysis failed',
            'message': str(e)
        }), 500

def rule_based_analysis(data):
    """Rule-based fallback when ML model is not available"""
    avg_score = data.get('avg_score', 0)
    topic_diversity = data.get('topic_diversity', 0)
    recent_improvement = data.get('recent_improvement', 0)
    
    # Determine performance level
    if avg_score >= 80 and topic_diversity >= 0.5:
        performance_level = 'Advanced'
    elif avg_score >= 60 and topic_diversity >= 0.3:
        performance_level = 'Intermediate'
    else:
        performance_level = 'Beginner'
    
    # Generate recommendation
    recommendation = generate_recommendation(
        performance_level,
        avg_score,
        topic_diversity,
        recent_improvement
    )
    
    return jsonify({
        'performance_level': performance_level,
        'recommendation': recommendation,
        'confidence': 'medium'
    })

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    print(f"🚀 Starting ML Service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
