import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic student performance data"""
    np.random.seed(42)
    
    data = []
    
    for _ in range(n_samples):
        # Randomly assign a performance level
        level = np.random.choice([0, 1, 2])  # 0: Beginner, 1: Intermediate, 2: Advanced
        
        if level == 0:  # Beginner
            avg_score = np.random.normal(45, 15)
            time_spent = np.random.normal(60, 20)
            completion_rate = np.random.normal(0.6, 0.15)
            topic_diversity = np.random.normal(0.25, 0.1)
            recent_improvement = np.random.normal(5, 10)
        
        elif level == 1:  # Intermediate
            avg_score = np.random.normal(70, 10)
            time_spent = np.random.normal(45, 15)
            completion_rate = np.random.normal(0.8, 0.1)
            topic_diversity = np.random.normal(0.5, 0.15)
            recent_improvement = np.random.normal(8, 8)
        
        else:  # Advanced
            avg_score = np.random.normal(88, 8)
            time_spent = np.random.normal(35, 10)
            completion_rate = np.random.normal(0.95, 0.05)
            topic_diversity = np.random.normal(0.7, 0.15)
            recent_improvement = np.random.normal(3, 5)
        
        # Clip values to realistic ranges
        avg_score = np.clip(avg_score, 0, 100)
        time_spent = np.clip(time_spent, 10, 120)
        completion_rate = np.clip(completion_rate, 0, 1)
        topic_diversity = np.clip(topic_diversity, 0, 1)
        recent_improvement = np.clip(recent_improvement, -30, 30)
        
        data.append([
            avg_score,
            time_spent,
            completion_rate,
            topic_diversity,
            recent_improvement,
            level
        ])
    
    columns = [
        'avg_score',
        'time_spent',
        'completion_rate',
        'topic_diversity',
        'recent_improvement',
        'performance_level'
    ]
    
    return pd.DataFrame(data, columns=columns)

def train_model():
    """Train the ML model for student performance classification"""
    print("📊 Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=1000)
    
    print(f"✅ Generated {len(df)} training samples")
    print("\nData distribution:")
    print(df['performance_level'].value_counts())
    
    # Prepare features and labels
    X = df.drop('performance_level', axis=1)
    y = df['performance_level']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n🔧 Training Random Forest Classifier...")
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n✅ Model trained successfully!")
    print(f"Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(
        y_test, 
        y_pred, 
        target_names=['Beginner', 'Intermediate', 'Advanced']
    ))
    
    # Feature importance
    print("\nFeature Importance:")
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance)
    
    # Save model
    model_path = 'model.pkl'
    joblib.dump(model, model_path)
    print(f"\n💾 Model saved to {model_path}")
    
    return model

if __name__ == "__main__":
    print("🤖 AI-Learn ML Model Training")
    print("=" * 50)
    model = train_model()
    print("\n" + "=" * 50)
    print("✨ Training complete! You can now run the Flask app.")
