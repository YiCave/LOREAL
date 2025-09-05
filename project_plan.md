# L'Oréal Hackathon: AI-Powered Comment Quality Analysis
## Project Plan & Technical Approach

### 🎯 **Problem Statement Overview**
- **Challenge**: Analyze quality and relevance of YouTube comments at scale for beauty/cosmetics content
- **Goal**: Build an AI solution to measure content effectiveness through Share of Engagement (SoE) metrics
- **Key Deliverables**: 
  - Functional prototype for comment analysis
  - Dashboard showing quality metrics, sentiment analysis, and spam detection
  - Recorded presentation

---

## 📊 **Dataset Understanding**

### **Comments Dataset (comments1-5.csv)**
- **Size**: 5 large CSV files (split due to size constraints)
- **Key Features**:
  - `textOriginal`: Raw comment text (primary feature for analysis)
  - `likeCount`: Engagement metric (will be used as quality indicator weight)
  - `videoId`: Link to video context
  - `publishedAt`: Temporal analysis
  - `parentCommentId`: Thread structure analysis

### **Videos Dataset (videos.csv)**
- **Context Data**:
  - `title`, `description`: Content context for relevance scoring
  - `tags`: Category classification (skincare, makeup, fragrance)
  - `topicCategories`: High-level content classification
  - `viewCount`, `likeCount`, `commentCount`: Engagement metrics

---

## 🔬 **Technical Approach: Batch-wise Random Forest Clustering**

### **Phase 1: Data Preprocessing & Feature Engineering**

#### **1.1 Text Processing Pipeline**
```
Raw Comment Text → Cleaning → Tokenization → Feature Extraction
```
- **Text Cleaning**: Remove URLs, special characters, normalize case
- **Language Detection**: Filter non-English comments or translate
- **Feature Extraction**: 
  - TF-IDF vectors for semantic content
  - Sentiment scores (positive/negative/neutral)
  - Comment length metrics
  - Emoji/special character ratios

#### **1.2 Engagement Features**
- **Like Count Normalization**: Scale relative to video's avg engagement
- **Reply Structure**: Parent vs. reply comments analysis
- **Temporal Features**: Comment recency, posting patterns

#### **1.3 Context Features**
- **Video Category Matching**: Extract keywords related to:
  - **Skincare**: moisturizer, serum, cleanser, SPF, etc.
  - **Makeup**: foundation, lipstick, eyeshadow, mascara, etc.
  - **Fragrance**: perfume, scent, fragrance, cologne, etc.
- **Brand Mentions**: Detect L'Oréal, competitor brands
- **Product-specific Terms**: Extract specific product mentions

### **Phase 2: Multi-Class Classification Strategy**

#### **2.1 Primary Classification: Spam vs. Non-Spam**
**Random Forest Model 1: Spam Detection**
- **Features**:
  - Text repetition patterns
  - External link presence
  - Generic vs. specific language
  - Engagement ratio (likes vs. text quality)
  - Account age indicators (if available)
- **Target Classes**: `[Spam, Not Spam]`

#### **2.2 Secondary Classification: Quality Assessment**
**Random Forest Model 2: Comment Quality (Non-Spam Only)**
- **Features**:
  - Relevance score to video content
  - Sentiment appropriateness
  - Constructive language patterns
  - Engagement metrics (weighted)
- **Target Classes**: `[High Quality, Medium Quality, Low Quality]`

#### **2.3 Tertiary Classification: Category Tagging**
**Random Forest Model 3: Content Categorization**
- **Features**:
  - Keyword matching scores
  - Video context alignment
  - Product mention patterns
- **Target Classes**: `[Skincare, Makeup, Fragrance, General, Off-topic]`

### **Phase 3: Batch Processing Strategy**

#### **3.1 Data Loading & Batching**
```python
# Pseudo-code structure
for batch_file in ['comments1.csv', 'comments2.csv', ...]:
    batch_data = load_and_preprocess(batch_file)
    processed_batch = feature_pipeline(batch_data)
    predictions = model_ensemble(processed_batch)
    results.append(predictions)
```

#### **3.2 Model Training Approach**
1. **Initial Training**: Use manually labeled subset for ground truth
2. **Iterative Improvement**: Use high-confidence predictions to expand training set
3. **Cross-validation**: Validate across different video types and time periods

### **Phase 4: Scoring & Metrics Framework**

#### **4.1 Quality Score Calculation**
```
Quality Score = (
    0.4 * Relevance_Score +
    0.25 * Sentiment_Appropriateness +
    0.2 * Engagement_Weight +
    0.1 * Language_Quality +
    0.05 * Constructiveness
)
```

#### **4.2 KPI Development**
- **Quality Ratio**: `High Quality Comments / Total Non-Spam Comments`
- **Engagement Efficiency**: `Quality Score * Like Count`
- **Category Distribution**: Breakdown by skincare/makeup/fragrance
- **Spam Detection Rate**: `Spam Detected / Total Comments`

---

## 🛠 **Implementation Plan**

### **Sprint 1: Data Pipeline (Day 1)**
- [ ] Load and explore all 6 datasets
- [ ] Create unified data processing pipeline
- [ ] Implement batch loading mechanism
- [ ] Basic EDA and data quality assessment

### **Sprint 2: Feature Engineering (Day 1-2)**
- [ ] Text preprocessing pipeline
- [ ] Sentiment analysis integration
- [ ] Video context feature extraction
- [ ] Engagement metric normalization

### **Sprint 3: Model Development (Day 2)**
- [ ] Implement Random Forest classifiers
- [ ] Create training data labeling strategy
- [ ] Model training and validation
- [ ] Hyperparameter tuning

### **Sprint 4: Integration & Dashboard (Day 2-3)**
- [ ] Batch prediction pipeline
- [ ] Results aggregation and scoring
- [ ] Interactive dashboard development
- [ ] Performance metrics visualization

### **Sprint 5: Validation & Presentation (Day 3)**
- [ ] End-to-end testing
- [ ] Results interpretation and insights
- [ ] Presentation preparation
- [ ] Demo video recording

---

## 📈 **Expected Outputs**

### **Dashboard Components**
1. **Quality Overview**:
   - Overall quality ratio
   - Spam detection statistics
   - Trend analysis over time

2. **Category Analysis**:
   - Comment distribution by beauty category
   - Top keywords per category
   - Engagement patterns by category

3. **Sentiment Insights**:
   - Sentiment distribution
   - Quality vs. sentiment correlation
   - Brand perception indicators

4. **Engagement Intelligence**:
   - High-quality comment examples
   - Engagement prediction insights
   - Content optimization recommendations

---

## 🔧 **Tech Stack**
- **Data Processing**: Pandas, NumPy
- **ML Framework**: Scikit-learn (Random Forest)
- **NLP**: NLTK, TextBlob, or spaCy
- **Visualization**: Plotly, Matplotlib, Seaborn
- **Dashboard**: Streamlit or Jupyter Widgets
- **Environment**: Jupyter Notebook

---

## 🎯 **Success Metrics**
- **Accuracy**: >85% spam detection accuracy
- **Relevance**: >80% accuracy in category classification
- **Performance**: Process 100k+ comments in <5 minutes
- **Usability**: Clear, actionable insights for marketing teams

---

## 💡 **Innovation Opportunities**
1. **Real-time Processing**: Extend to live comment monitoring
2. **Competitor Analysis**: Compare engagement patterns across brands
3. **Trend Detection**: Identify emerging beauty topics/concerns
4. **Automated Response**: Suggest responses to high-quality comments
5. **Influencer Identification**: Detect potential brand advocates

---

*This plan provides a comprehensive roadmap for building L'Oréal's AI-powered comment analysis solution, focusing on scalable batch processing with Random Forest models to deliver actionable insights for content strategy optimization.*
