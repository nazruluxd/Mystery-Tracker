# GitHub এ Mystery Tracker অ্যাপ আপলোড করার সম্পূর্ণ গাইড

## ধাপ ১: GitHub অ্যাকাউন্ট তৈরি করুন

1. https://github.com এ যান
2. সাইন আপ করুন (যদি অ্যাকাউন্ট না থাকে)
3. ভেরিফিকেশন সম্পূর্ণ করুন

---

## ধাপ ২: নতুন Repository তৈরি করুন

### ওয়েব ইন্টারফেসে:

1. GitHub এ লগইন করুন
2. টপ রাইট কর্নারে **`+`** ক্লিক করুন
3. **`New repository`** সিলেক্ট করুন
4. নিম্নলিখিত তথ্য পূরণ করুন:

```
Repository name: mystery-tracker
Description: A professional mystery tracker app to track unsolved questions
Visibility: Public (সবাই দেখতে পারবে)
Initialize with:
  ✓ Add a README file
  ✓ Add .gitignore (Node)
  ✓ Choose a license (MIT)
```

5. **`Create repository`** বাটন ক্লিক করুন

---

## ধাপ ৩: আপনার কম্পিউটারে Setup করুন

### প্রয়োজনীয় সফটওয়্যার ইনস্টল করুন:

#### Windows এ:
```bash
# Git ডাউনলোড করুন
https://git-scm.com/download/win
# ইনস্টল করুন এবং সব ডিফল্ট অপশন রাখুন
```

#### Mac এ:
```bash
brew install git
```

#### Linux এ:
```bash
sudo apt-get install git
```

---

## ধাপ ৪: প্রজেক্ট ফোল্ডার তৈরি করুন

```bash
# নতুন ফোল্ডার তৈরি করুন
mkdir mystery-tracker
cd mystery-tracker

# এখানে সব ফাইল রাখবেন
```

---

## ধাপ ৫: প্রজেক্ট ফাইল সেটআপ

আপনার `mystery-tracker` ফোল্ডারে নিম্নলিখিত ফাইলসমূহ তৈরি করুন:

### ১. `package.json` তৈরি করুন

```bash
npm init -y
```

অথবা সরাসরি এই কন্টেন্ট দিয়ে `package.json` ফাইল তৈরি করুন এবং সেভ করুন।

### ২. প্রয়োজনীয় ফাইলসমূহ তৈরি করুন:

```
mystery-tracker/
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
└── .env (অপশনাল)
```

---

## ধাপ ৬: Git কনফিগার করুন (প্রথমবার)

কমান্ড প্রম্পট/টার্মিনাল খুলুন এবং এই কমান্ড চালান:

```bash
# আপনার নাম এবং ইমেইল সেট করুন
git config --global user.name "আপনার নাম"
git config --global user.email "আপনার-ইমেইল@example.com"
```

---

## ধাপ ৭: Repository ক্লোন করুন

GitHub থেকে আপনার রিপোজিটরির লিঙ্ক কপি করুন:

```bash
# আপনার-ইউজারনেম দিয়ে রিপ্লেস করুন
git clone https://github.com/আপনার-ইউজারনেম/mystery-tracker.git
cd mystery-tracker
```

---

## ধাপ ৮: ফাইলসমূহ যোগ করুন

আপনার `mystery-tracker` ফোল্ডারে এই ফাইলগুলো কপি করুন:

1. `professional_mystery_tracker.jsx` → `src/App.jsx`
2. অন্যান্য প্রয়োজনীয় ফাইলসমূহ

---

## ধাপ ৯: Git এ পরিবর্তন যোগ করুন এবং Push করুন

টার্মিনালে নিম্নলিখিত কমান্ডগুলো চালান:

```bash
# সব নতুন/পরিবর্তিত ফাইল যোগ করুন
git add .

# পরিবর্তনগুলো সংরক্ষণ করুন (Commit)
git commit -m "Initial commit: Add Mystery Tracker app"

# GitHub এ আপলোড করুন (Push)
git push origin main
```

---

## ধাপ ১০: আপনার GitHub প্রোফাইলে দেখুন

1. GitHub.com এ যান এবং লগইন করুন
2. আপনার প্রোফাইল পেজে যান
3. `mystery-tracker` রিপোজিটরি দেখতে পাবেন

---

## পরবর্তী পরিবর্তন যোগ করার সময়:

যখনই নতুন পরিবর্তন করবেন, এই কমান্ড চালান:

```bash
# পরিবর্তনগুলো দেখুন
git status

# সব পরিবর্তন যোগ করুন
git add .

# পরিবর্তন বর্ণনা সহ সংরক্ষণ করুন
git commit -m "আপনার পরিবর্তনের বর্ণনা"

# GitHub এ আপলোড করুন
git push origin main
```

---

## সাধারণ সমস্যা এবং সমাধান:

### ❌ সমস্যা: "fatal: not a git repository"
```bash
# সমাধান: প্রথমে ক্লোন করুন
cd mystery-tracker
git init
```

### ❌ সমস্যা: "Permission denied" 
```bash
# সমাধান: SSH কী সেটআপ করুন
ssh-keygen -t ed25519 -C "আপনার-ইমেইল@example.com"
# GitHub Settings > SSH and GPG keys এ যোগ করুন
```

### ❌ সমস্যা: "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# সমাধান:
git remote add origin https://github.com/আপনার-ইউজারনেম/mystery-tracker.git
git branch -M main
git push -u origin main
```

---

## আপনার অ্যাপকে Live করুন (GitHub Pages)

### ধাপ ১: Repository Settings এ যান
- GitHub এ আপনার রিপোজিটরি খুলুন
- **Settings** ট্যাব ক্লিক করুন

### ধাপ ২: Pages সেক্শন খুলুন
- বাম সাইডবার থেকে **Pages** খুঁজুন
- **Source** → **Deploy from a branch** সিলেক্ট করুন
- **Branch** → **main** সিলেক্ট করুন
- **Save** ক্লিক করুন

### ধাপ ৩: আপনার সাইট লাইভ
কিছুক্ষণ পর আপনি একটি লিঙ্ক পাবেন:
```
https://আপনার-ইউজারনেম.github.io/mystery-tracker/
```

এই লিঙ্কে আপনার অ্যাপ লাইভ থাকবে!

---

## সহায়ক কমান্ড চিটশীট:

```bash
# বর্তমান স্ট্যাটাস দেখুন
git status

# সব কমিট হিস্টরি দেখুন
git log

# শেষ কমিট বাতিল করুন
git reset HEAD~1

# একটি নির্দিষ্ট ফাইল বাতিল করুন
git restore <filename>

# সব পরিবর্তন বাতিল করুন
git reset --hard

# বর্তমান ব্র্যাঞ্চ দেখুন
git branch

# নতুন ব্র্যাঞ্চ তৈরি করুন
git checkout -b নতুন-ব্র্যাঞ্চ-নাম
```

---

## আরও তথ্যের জন্য:

- **GitHub সাহায্য**: https://docs.github.com
- **Git টিউটোরিয়াল**: https://git-scm.com/book
- **GitHub Desktop**: https://desktop.github.com (GUI ব্যবহার করতে চাইলে)

---

**সাফল্য!! আপনার অ্যাপ এখন GitHub এ লাইভ আছে! 🎉**
