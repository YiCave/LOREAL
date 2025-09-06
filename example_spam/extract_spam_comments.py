#!/usr/bin/env python3
"""
Extract 100 Spam Comments from complete_comments_with_features.csv

This script reads the complete comments dataset and extracts 100 spam comments
for analysis and review purposes.
"""

import pandas as pd
import os

def extract_spam_comments():
    """Extract 100 spam comments from the complete dataset"""
    
    # File paths
    input_file = 'complete_comments_with_features.csv'
    output_file = 'spam_comments_sample_100.csv'
    
    print("🔍 Extracting 100 spam comments...")
    print(f"📂 Reading from: {input_file}")
    
    try:
        # Read the complete dataset
        print("📊 Loading complete dataset...")
        df = pd.read_csv(input_file)
        
        print(f"✅ Dataset loaded successfully!")
        print(f"   📈 Total rows: {len(df):,}")
        print(f"   📋 Total columns: {len(df.columns)}")
        
        # Check if spam_classification column exists
        if 'spam_classification' not in df.columns:
            print("❌ Error: 'spam_classification' column not found!")
            print(f"Available columns: {list(df.columns)}")
            return
        
        # Check spam distribution
        spam_distribution = df['spam_classification'].value_counts()
        print(f"\n📊 Spam Classification Distribution:")
        for label, count in spam_distribution.items():
            percentage = count / len(df) * 100
            print(f"   {label}: {count:,} ({percentage:.1f}%)")
        
        # Filter spam comments
        spam_comments = df[df['spam_classification'] == 'spam'].copy()
        
        if len(spam_comments) == 0:
            print("❌ No spam comments found in the dataset!")
            return
        
        print(f"\n🚫 Found {len(spam_comments):,} spam comments")
        
        # Extract 100 spam comments (or all if less than 100)
        sample_size = min(100, len(spam_comments))
        spam_sample = spam_comments.head(sample_size)
        
        print(f"📤 Extracting {sample_size} spam comments...")
        
        # Save to new CSV
        spam_sample.to_csv(output_file, index=False, encoding='utf-8')
        
        print(f"✅ Spam comments extracted successfully!")
        print(f"   📁 Output file: {output_file}")
        print(f"   📊 Rows extracted: {len(spam_sample):,}")
        print(f"   📋 Columns: {len(spam_sample.columns)}")
        
        # Show ALL extracted spam comments
        print(f"\n📝 All {sample_size} Spam Comments:")
        print("=" * 80)
        
        for i, (idx, row) in enumerate(spam_sample.iterrows(), 1):
            text = str(row.get('textOriginal', 'N/A'))  # Show complete text without truncation
            confidence = row.get('classification_confidence', 'N/A')
            
            print(f"\n{i:3d}. Spam Comment:")
            print(f"     Text: \"{text}\"")
            print(f"     Confidence: {confidence}")
            if 'likeCount' in row:
                print(f"     Likes: {row['likeCount']}")
            if 'feature_char_count' in row:
                print(f"     Character Count: {row['feature_char_count']}")
        
        print("\n" + "=" * 80)
        print(f"🎯 Summary:")
        print(f"   📊 Successfully extracted {sample_size} spam comments")
        print(f"   📁 Saved to: {output_file}")
        print(f"   ✅ Ready for analysis!")
        
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found!")
        print("Please make sure the file exists in the current directory.")
        
    except Exception as e:
        print(f"❌ Error occurred: {str(e)}")
        print("Please check the file format and try again.")

if __name__ == "__main__":
    print("🚫 Spam Comments Extractor")
    print("=" * 50)
    
    # Check if input file exists
    input_file = 'complete_comments_with_features.csv'
    if not os.path.exists(input_file):
        print(f"❌ Input file '{input_file}' not found in current directory!")
        print("Please make sure the file exists and try again.")
    else:
        extract_spam_comments()
    
    print("\n🏁 Script completed!")
