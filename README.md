# SchemeSense - AI-Powered Government Scheme Discovery Platform

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-AWS-orange)

## 🎯 Project Overview

**SchemeSense** is an intelligent, AI-powered web platform designed to democratize access to government schemes across India. It simplifies government scheme discovery and application for Indian citizens by enabling them to describe their real-life problems in natural language instead of navigating complex government portals.

### Key Mission
Remove barriers to accessing government benefits by eliminating:
- Language barriers (support for Hindi, Marathi, and English)
- Technical complexity in scheme navigation
- Information asymmetry about available schemes
- Lengthy application processes

### Target Users
- Rural citizens and farmers
- Urban low-income groups
- Students and job seekers
- Senior citizens
- Women and marginalized communities
- Government officials and NGO workers

---

## ✨ Core Features

### 1. **Conversational Interface**
- Natural language text input with support for conversational language
- Multi-turn conversation management
- Context preservation across interactions
- Intelligent follow-up question generation

### 2. **Intelligent Scheme Discovery**
- AI-powered scheme matching based on user situations
- RAG (Retrieval-Augmented Generation) system with vector search
- Semantic understanding of government documents
- Relevance scoring and scheme ranking

### 3. **Eligibility Evaluation**
- Automated eligibility assessment for discovered schemes
- Multi-condition logic evaluation
- Personalized document requirement checklists
- Clear explanations of eligibility status

### 4. **Application Assistance**
- Step-by-step form filling guidance
- Auto-population of user information
- Form validation before submission
- Progress saving and resume functionality

### 5. **Multilingual Support**
- Support for Hindi, Marathi, and English
- Automatic language detection
- Real-time translation between languages
- Cultural adaptation of content

### 6. **Document Processing**
- OCR (Optical Character Recognition) for document verification
- Production-grade image processing
- Document extraction and analysis
- Support for various document formats

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────┐
│  Frontend Layer     │
│  (React + TypeScript)
│  - Web App (Vite)   │
│  - UI Components    │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│  API Layer          │
│  - Flask Server     │
│  - AWS Lambda       │
│  - API Gateway      │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────────┐
│  Backend Services                   │
├─────────────────┬───────────────────┤
│ DB Manager      │ RAG Processor     │
│ - DynamoDB      │ - Bedrock LLM     │
│ - Query Builder │ - Vector Search   │
│                 │ - Context Mgmt    │
├─────────────────┼───────────────────┤
│ OCR Processor   │ Logger/Utils      │
│ - Document     │ - Logging         │
│   Processing   │ - Utilities       │
└─────────────────┴───────────────────┘
```

### Component Architecture

**Three deployment targets:**

1. **Backend (Local/Server)** - `backend/app.py`
   - Flask-based REST API server
   - Local development and testing
   - Debug-friendly setup

2. **API Gateway + Lambda** - `api/index.py`
   - AWS Lambda handler for serverless deployment
   - AWS API Gateway integration
   - Production-grade scalability
   - Zero-dependency for core runtime (uses AWS-provided boto3)

3. **Frontend** - `frontend/src/`
   - React application with TypeScript
   - Vite-based build system
   - Material-UI and Radix UI components
   - Responsive design with Tailwind CSS

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18.3.x** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite 6.3.5** | Build tool and dev server |
| **React Router 7.13** | Client-side routing |
| **Material-UI 7.3.5** | Material Design components |
| **Radix UI** | Accessible component library |
| **Tailwind CSS 4.1.12** | Utility-first CSS |
| **Lucide React** | Icon library |
| **React Hook Form** | Form management |
| **Recharts** | Data visualization |
| **Sonner** | Toast notifications |
| **React Markdown** | Markdown rendering |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Python 3.x** | Programming language |
| **Flask** | Web framework (dev server) |
| **Boto3** | AWS SDK for Python |
| **AWS Bedrock** | LLM and AI models |
| **AWS DynamoDB** | NoSQL database |
| **AWS Lambda** | Serverless compute (production) |
| **AWS API Gateway** | API management |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Terraform** | Infrastructure as Code |
| **AWS** | Cloud platform |
| **DynamoDB** | Document database |
| **S3** | Object storage |
| **Lambda** | Serverless functions |
| **API Gateway** | Request routing & management |

### AI/ML Components
| Component | Purpose |
|-----------|---------|
| **AWS Bedrock** | LLM inference |
| **Vector Search** | Semantic similarity matching |
| **RAG System** | Retrieval-Augmented Generation |
| **OCR** | Document text extraction |

---

## 📁 Project Structure

```
SchemeSense-main/
├── frontend/                       # React frontend application
│   ├── src/
│   │   ├── app/                   # Main app component & routes
│   │   ├── pages/                 # Page components
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Layout.tsx         # Layout component
│   │   │   ├── figma/             # Figma-designed components
│   │   │   └── ui/                # Atomic UI components
│   │   ├── lib/                   # Utilities & APIs
│   │   │   └── api.ts             # API client
│   │   └── styles/                # Global styles & themes
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.ts             # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── tsconfig.json              # TypeScript config
│
├── backend/                        # Flask backend server
│   ├── app.py                     # Flask application entry point
│   ├── config.py                  # Configuration settings
│   ├── requirements.txt            # Python dependencies
│   ├── urls.py                    # Route definitions
│   ├── src/                       # Backend source code
│   │   ├── db/                    # Database management
│   │   │   ├── dynamo_manager.py # DynamoDB operations
│   │   │   └── dynamo_setup.py   # Schema initialization
│   │   ├── rag/                   # RAG system
│   │   │   └── bedrock_processor.py # LLM interactions
│   │   ├── utils/                 # Utilities
│   │   │   └── logger.py          # Logging setup
│   │   └── verification/          # Document processing
│   │       └── production_ocr.py  # OCR functionality
│   ├── data/                      # Data files
│   └── build/                     # Lambda build artifacts
│
├── api/                           # AWS Lambda deployment
│   ├── index.py                   # Lambda handler entry point
│   ├── config.py                  # Configuration
│   ├── requirements.txt            # Python dependencies
│   ├── urls.py                    # API routes
│   ├── src/                       # Shared source code (symlinked)
│   └── data/                      # Scheme data files
│
├── terraform/                     # Infrastructure as Code
│   ├── main.tf                    # Main Terraform configuration
│   ├── variables.tf               # Variable definitions
│   ├── outputs.tf                 # Output definitions
│   ├── api_gateway.tf             # API Gateway setup
│   ├── lambda.tf                  # Lambda function setup
│   ├── dynamodb.tf                # DynamoDB table setup
│   ├── iam.tf                     # IAM roles & policies
│   ├── s3.tf                      # S3 bucket setup
│   ├── frontend.tf                # Frontend deployment
│   └── budgets.tf                 # AWS budgets
│
├── requirements.md                # Software requirements specification
├── design.md                      # System design document
├── PERFORMANCE_REPORT.md          # Performance metrics
├── README.md                      # This file
├── run_backend.ps1                # PowerShell script to start backend
├── urls.py                        # Shared URL configuration
└── vercel.json                    # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **AWS Account** with appropriate credentials configured
- **Git** for version control
- **Terraform** (for infrastructure deployment)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### Backend Setup (Local Development)

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure AWS credentials
aws configure
# Or set environment variables:
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1

# Run the Flask development server
python app.py
# Server runs on http://localhost:5000
```

### Quick Start Script (Windows PowerShell)

```powershell
# Run the provided startup script
.\run_backend.ps1
```

---

## 🔌 API Endpoints

### Schemes Management

#### Get All Schemes
```
GET /api/schemes
Response: Array of scheme objects
```

#### Get Specific Scheme
```
GET /api/schemes/{scheme_id}
Response: Single scheme object with full details
```

#### Search Schemes
```
POST /api/schemes/search
Body: { "query": "pension scheme" }
Response: Array of matching schemes
```

### Chat & Conversation

#### Chat Endpoint
```
POST /api/chat
Headers: Content-Type: application/json
Body: {
  "query": "I am a farmer looking for agricultural assistance",
  "user_id": "optional_user_id"
}
Response: {
  "response": "AI-generated response with matching schemes",
  "schemes": [...],
  "follow_up_questions": [...]
}
```

### Document Processing

#### Upload Document
```
POST /api/documents/upload
Body: FormData with file
Response: {
  "document_id": "...",
  "extracted_text": "...",
  "processing_status": "completed"
}
```

#### Process with OCR
```
POST /api/documents/ocr
Body: FormData with image
Response: {
  "extracted_text": "...",
  "confidence": 0.95,
  "document_type": "..."
}
```

### Utilities

#### Health Check
```
GET /api/health
Response: { "status": "ok" }
```

---

## 🔄 Data Flow

### User Interaction Flow

```
1. User Input (Text)
   ↓
2. Frontend sends to /api/chat
   ↓
3. Backend receives request
   ↓
4. Language Detection
   ↓
5. Query Enhancement & Entity Extraction
   ↓
6. Vector Search in Scheme Database
   ↓
7. Context Retrieval from DynamoDB
   ↓
8. Prompt Construction with RAG Context
   ↓
9. AWS Bedrock LLM Processing
   ↓
10. Response Generation
   ↓
11. Translation (if needed) & Formatting
   ↓
12. Response sent to Frontend
   ↓
13. UI Display to User
```

### Database Schema

**Schemes Table (DynamoDB)**
```json
{
  "scheme_id": "string (PK)",
  "name": "string",
  "description": "string",
  "benefits": "string",
  "eligibility": "string",
  "documents_required": ["array"],
  "application_process": "string",
  "state_specific": "boolean",
  "ministry": "string",
  "launch_date": "string",
  "last_updated": "string",
  "category": "string"
}
```

---

## 🐳 Deployment

### AWS Lambda Deployment

1. **Build Lambda package:**
   ```bash
   cd api
   ./build_lambda.ps1  # or build_lambda.sh for Linux
   ```

2. **Deploy with Terraform:**
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

3. **Environment Variables (Lambda):**
   ```
   AWS_REGION=us-east-1
   DYNAMODB_TABLE=schemes
   BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
   ```

### Frontend Deployment (Vercel)

```bash
# Deploy to Vercel
vercel deploy
```

Alternatively, configure in `vercel.json` and use:
```bash
vercel --prod
```

### Frontend Deployment (Static Hosting)

```bash
# Build static files
cd frontend
npm run build

# Upload dist/ folder to:
# - AWS S3
# - Vercel
# - Netlify
# - GitHub Pages
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- OTP-based login support
- Session management via secure tokens
- Role-based access control (RBAC)
- API key authentication for external integrations

### Data Protection
- AES-256 encryption for sensitive data
- HTTPS/TLS for all communications
- Encrypted database at rest
- Regular security audits

### Privacy Compliance
- PDPA (Personal Data Protection Act) compliance
- Right to deletion implemented
- Data minimization principles
- Audit logging for all data access

### Environment Security
- No secrets in code repositories
- AWS Secrets Manager for credentials
- Restricted IAM permissions
- VPC isolation for resources

---

## 📊 Key Modules

### Database Manager (`src/db/dynamo_manager.py`)
Handles all DynamoDB operations:
- `get_all_schemes()` - Retrieve all schemes
- `get_scheme(scheme_id)` - Get specific scheme
- `search_schemes(query)` - Search by relevance
- `create_user()` - User registration
- `save_conversation()` - Store chat history

### RAG Processor (`src/rag/bedrock_processor.py`)
AI/ML pipeline:
- `generate_chat_response(prompt)` - LLM inference
- Context management for conversations
- Integration with AWS Bedrock
- Response formatting and validation

### OCR Processor (`src/verification/production_ocr.py`)
Document processing:
- `process_image(image_path)` - Extract text from images
- `extract_document_type()` - Classify documents
- `get_confidence_score()` - Quality assurance

### Logger (`src/utils/logger.py`)
Logging utilities:
- Structured logging
- Multiple log levels
- File and console output
- Production-grade error tracking

---

## 🧪 Testing

### Unit Tests
```bash
# Run tests (when test framework is configured)
python -m pytest tests/

# With coverage
python -m pytest --cov=src tests/
```

### Frontend Testing
```bash
# Component tests with Vitest
npm run test

# Coverage report
npm run test:coverage
```

### Integration Testing
```bash
# Test API endpoints
curl http://localhost:5000/api/schemes

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"I need help with pension"}'
```

---

## 📈 Performance Optimization

### Caching Strategy
- DynamoDB point-in-time recovery
- Query result caching
- Vector search index optimization
- TTL on temporary data

### Database Optimization
- Proper indexing on frequently queried fields
- Query result pagination
- Batch operations for bulk inserts
- Connection pooling

### Frontend Optimization
- Code splitting with Vite
- Lazy loading for routes
- Image optimization
- Service workers for offline support

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow code standards:**
   - Python: PEP 8 with 4-space indentation
   - TypeScript: ESLint configuration in frontend/
   - Commit messages: Conventional commits format
   - Code style: Prettier formatting

3. **Testing before push:**
   ```bash
   # Run linting
   npm run lint  # Frontend
   pylint src/   # Backend

   # Run tests
   npm run test  # Frontend
   python -m pytest tests/  # Backend
   ```

4. **Submit pull request:**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Test coverage information

### Code Style

**Python:**
```bash
# Format with black
black src/

# Lint with pylint
pylint src/

# Check with flake8
flake8 src/
```

**TypeScript/React:**
```bash
# Format with prettier
npx prettier --write src/

# Lint with eslint
npm run lint
```

---

## 📝 Environment Configuration

### Development Environment
Create `.env.development` or `.env.local`:
```env
# Backend
FLASK_ENV=development
FLASK_DEBUG=True
AWS_REGION=us-east-1
DYNAMODB_TABLE=schemes-dev

# Frontend
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### Production Environment
Set via environment variables or secrets manager:
```env
AWS_REGION=us-east-1
DYNAMODB_TABLE=schemes-prod
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
CORS_ORIGINS=https://yourdomain.com
LOG_LEVEL=INFO
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "Module not found" error**
```bash
# Solution: Ensure Python paths are correct
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

**Issue: DynamoDB connection fails**
```bash
# Solution: Verify AWS credentials
aws sts get-caller-identity
aws configure
```

**Issue: Frontend API calls fail**
```bash
# Solution: Check CORS configuration
# Verify backend is running and accessible
curl http://localhost:5000/api/health
```

**Issue: Lambda deployment fails**
```bash
# Solution: Check IAM permissions and Lambda layer size
# Rebuild without unnecessary dependencies
pip install -r requirements.txt --no-cache-dir
```

---

## 📚 Additional Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [React Documentation](https://react.dev)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [Python Flask Documentation](https://flask.palletsprojects.com/)
- [Vite Documentation](https://vitejs.dev)

---

## 📄 Documentation

- [Requirements Specification](./requirements.md) - Detailed feature requirements
- [System Design](./design.md) - Architecture and design decisions
- [Performance Report](./PERFORMANCE_REPORT.md) - Performance metrics and benchmarks

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation
- Review design specifications
- Consult with the development team

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Powered by AWS services and AI models
- Designed to serve Indian citizens and their government entitlements
- Community contributions and feedback welcome

---

**Last Updated:** March 9, 2026  
**Version:** 0.0.1-beta  
**Status:** Active Development
