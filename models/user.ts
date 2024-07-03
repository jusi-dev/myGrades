import mongoose, { Schema, models } from 'mongoose';

const GradeSchema = new Schema({
    grade_name: { type: String, required: true },
    grade_value: { type: Number, required: true },
    weight: { type: Number, required: true }
});

const SubjectSchema = new Schema({
    subject_name: { type: String, required: true },
    grades: [GradeSchema]  // Array von Noten
  });
  
  // Semester Schema
  const SemesterSchema = new Schema({
    semester_id: { type: String, required: true },
    semester_name: { type: String, required: true },
    subjects: [SubjectSchema]  // Array von Fächern
  });

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    semesters: [SemesterSchema],
    resetToken: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    },
    receivesMailNotifications: {
        type: [String],
        required: false,
        default: []
    },
    apprentices: {
        type: [String],
        required: false,
        default: [],
    },
    isSuperadmin: {
        type: Boolean,
        required: false,
        default: false
    
    },
}, { timestamps: true });

const User = models.User ||  mongoose.model('User', userSchema);
export default User;