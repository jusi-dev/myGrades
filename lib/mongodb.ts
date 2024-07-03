"use server"

import User from '@/models/user';
import { Users } from 'lucide-react';
import mongoose from 'mongoose';
import { Document } from 'mongoose'; // Import the Document type from mongoose
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
    } catch (error) {
        console.error(error);
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        // Get the user by email
        await connectMongoDB();
        const mongoUser = await User.findOne({ email });

        const user = mongoUser?.toObject();

        if (!user) {
            return {};
        }

        delete user!.password;

        // serialize mongoose object and return it


        return { user };
    } catch (error) {
        console.log("No user found: ", error)
        return {};
    }

}

export const createSubjectForUser = async (userId: string, subject: string, semesterId: string) => {
    try {
        
        console.log("Creating subject for user", userId, subject)
        // Create a new subject for the user
        const filter = { _id: userId, 'semesters.semester_id': semesterId };

        const updateDoc = {
            $push: { 'semesters.$.subjects': {
                    subject_name: subject,
                    grades: []
                },
            }
        };

        const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });

        console.log("Result", result)

    } catch (error) {
        console.error(error);
    }
}

export const createSemesterForUser = async (userId: string, semesterCount: number) => {
    try {
        // Create a new subject for the user
        const filter = { _id: userId };

        const updateDoc = {
            $push: { semesters: {
                    semester_name: `Semester ${semesterCount}`,
                    semester_id: `semester_${semesterCount}`,
                    subjects: []
                },
            },
        };

        const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });

        console.log("Result", result)

    } catch (error) {
        console.error(error);
    }
}

export const createGradeForSubject = async (userId: string, semesterId: string, subjectId: string, grade_name: string, grade: number, grade_weight: number) => {
    try {
        // Suche nach dem Benutzer und dem spezifischen Semester
        const user = await User.findOne({
          _id: userId,
          'semesters.semester_id': semesterId,
        });
    
        if (!user) {
          throw new Error('Benutzer oder Semester nicht gefunden');
        }
    
        // Finde das spezifische Semester
        const semester = user.semesters.find((s: any) => s.semester_id === semesterId);
        if (!semester) {
          throw new Error('Semester nicht gefunden');
        }

        const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    
        // Finde das spezifische Fach innerhalb des Semesters
        const subject = semester.subjects.find((sub: any) => sub._id == subjectId);


        if (!subject) {
          throw new Error('Fach nicht gefunden');
        }
    
        // Füge die neue Note zum subjects Array hinzu
        subject.grades.push({
          grade_name,
          grade_value: grade,
          weight: grade_weight
        });
    
        // Speichere die Änderungen am Benutzer
        await user.save();
    
        console.log("Erfolgreich hinzugefügte Note:", subject.grades);
        return true;
    
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Note:', (error as unknown as string));
      }
}

export const deleteGradeForSubject = async (userId: string, semesterId: string, subjectId: string, gradeId: string) => {
    try {
        // Suche nach dem Benutzer und dem spezifischen Semester
        const user = await User.findOne({
            _id: userId,
            'semesters.semester_id': semesterId,
        });

        if (!user) {
            throw new Error('Benutzer oder Semester nicht gefunden');
        }

        // Finde das spezifische Semester
        const semester = user.semesters.find((s: any) => s.semester_id === semesterId);

        if (!semester) {
            throw new Error('Semester nicht gefunden');
        }

        // Finde das spezifische Fach innerhalb des Semesters

        const subject = semester.subjects.find((sub: any) => sub._id == subjectId);

        if (!subject) {
            throw new Error('Fach nicht gefunden');
        }

        // Finde die spezifische Note innerhalb des Fachs

        const grade = subject.grades.find((g: any) => g._id == gradeId);

        if (!grade) {
            throw new Error('Note nicht gefunden');
        }

        // Entferne die Note aus dem subjects Array

        subject.grades = subject.grades.filter((g: any) => g._id != gradeId);

        // Speichere die Änderungen am Benutzer

        await user.save();

        console.log("Erfolgreich gelöschte Note:", grade);

        return true;

    } catch (error) {
        console.error('Fehler beim Löschen der Note:', (error as unknown as string));
    }
}

export const deleteSubjectForSemester = async (userId: string, semesterId: string, subjectId: string) => {
    try {
        // Suche nach dem Benutzer und dem spezifischen Semester
        const user = await User.findOne({
            _id: userId,
            'semesters.semester_id': semesterId,
        });

        if (!user) {
            throw new Error('Benutzer oder Semester nicht gefunden');
        }

        // Finde das spezifische Semester

        const semester = user.semesters.find((s: any) => s.semester_id === semesterId);

        if (!semester) {
            throw new Error('Semester nicht gefunden');
        }

        // Finde das spezifische Fach innerhalb des Semesters

        const subject = semester.subjects.find((sub: any) => sub._id == subjectId);

        if (!subject) {
            throw new Error('Fach nicht gefunden');
        }

        // Entferne das Fach aus dem subjects Array

        semester.subjects = semester.subjects.filter((sub: any) => sub._id != subjectId);

        // Speichere die Änderungen am Benutzer

        await user.save();

        console.log("Erfolgreich gelöschtes Fach:", subject);

        return true;

    } catch (error) {
        console.error('Fehler beim Löschen des Fachs:', (error as unknown as string));
    }
}

export const deleteSemesterForUser = async (userId: string, semesterId: string) => {
    try {
        // Suche nach dem Benutzer
    
        const user = await User.findOne({
            _id: userId,
            'semesters.semester_id': semesterId,
        });

        if (!user) {
            throw new Error('Benutzer oder Semester nicht gefunden');
        }

        // Entferne das Semester aus dem semesters Array

        user.semesters = user.semesters.filter((s: any) => s.semester_id != semesterId);

        // Speichere die Änderungen am Benutzer

        await user.save();

        console.log("Erfolgreich gelöschtes Semester:", semesterId);

        return true;

    } catch (error) {
        console.error('Fehler beim Löschen des Semesters:', (error as unknown as string));
    }
}

export const setResetToken = async (email: string, resetToken: string) => {
    try {
        // Suche nach dem Benutzer
        const user = await User.findOne({ email
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Setze das Reset-Token
        user.resetToken = resetToken;

        // Speichere die Änderungen am Benutzer
        await user.save();

        console.log("Erfolgreich gesetztes Reset-Token:", resetToken);

        return true;

    } catch (error) {
        console.error('Fehler beim Setzen des Reset-Tokens:', (error as unknown as string));
    }
}

export const getAllUsers = async (callingUser: any) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach allen Benutzern
        const allUsers = await User.find();


        const users: any[] = allUsers?.map((user: Document) => user.toObject()); // Use the toObject method on each user document

        // Entferne die Passwörter aus den Benutzern
        users.forEach(user => {
            delete user.password;
        });

        // console.log("Alle Benutzer:", filteredUsers);

        return {users};
    } catch (error) {
        console.error('Fehler beim Abrufen aller Benutzer:', (error as unknown as string));
        throw new Error('Fehler beim Abrufen aller Benutzer');
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Lösche den Benutzer
        await User.deleteOne({ _id:
            userId });
        
        console.log("Erfolgreich gelöschter Benutzer:", userId);

        return true;

    } catch (error) {
        console.error('Fehler beim Löschen des Benutzers:',
        (error as unknown as string));
    }
}

export const makeUserAdmin = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Setze den Benutzer als Admin
        user.isAdmin = true;

        // Speichere die Änderungen am Benutzer
        await user.save();

        console.log("Erfolgreich gesetzter Admin:", userId);

        return true;

    } catch (error) {
        console.error('Fehler beim Setzen des Admins:', (error as unknown as string));
    }
}

export const makeUserSuperadmin = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Setze den Benutzer als Admin
        user.isSuperadmin = true;

        // Speichere die Änderungen am Benutzer
        await user.save();

        console.log("Erfolgreich gesetzter Admin:", userId);

        return true;

    } catch (error) {
        console.error('Fehler beim Setzen des Admins:', (error as unknown as string));
    }
}

export const removeUserAdmin = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Setze den Benutzer als Admin
        user.isAdmin = false;
        user.isSuperadmin = false;

        // Speichere die Änderungen am Benutzer
        await user.save();

        console.log("Erfolgreich entfernter Admin:", userId);

        return true;

    } catch (error) {
        console.error('Fehler beim Entfernen des Admins:', (error as unknown as string));
    }
}

export const removeUserSuperadmin = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Setze den Benutzer als Admin
        user.isSuperadmin = false;

        // Speichere die Änderungen am Benutzer
        await user.save();

        console.log("Erfolgreich entfernter Admin:", userId);

        return true;

    } catch (error) {
        console.error('Fehler beim Entfernen des Admins:', (error as unknown as string));
    }
}

export const toggleMailNotifications = async (userId: string) => {
    try {
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }


        // Convert new ObjectId to string
        const convertedId = user._id.toString()

        // Check if the user._id already exists in the receivesMailNotifications array
        if (callingUser.user.receivesMailNotifications.includes(convertedId)) {
            // Füge die ausgewählte Mail-Adresse zum Benutzer hinzu

            console.log("Nopeeee")
            const filter = { _id: callingUser.user._id };

            const updateDoc = {
                $pull: { receivesMailNotifications: user._id },
            };
    
            const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });
    
            console.log("Erfolgreich hinzugefügter Lehrling:", result);
        } else {
            console.log("Yessss")
            // Füge die ausgewählte Mail-Adresse zum Benutzer hinzu
            const filter = { _id: callingUser.user._id };

            const updateDoc = {
                $push: { receivesMailNotifications: user._id },
            };
    
            const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });
    
            console.log("Erfolgreich hinzugefügter Lehrling:", result);
        }

        return true;

    } catch (error) {
        console.error('Fehler beim Setzen der Mail-Benachrichtigungen:', (error as unknown as string));
    }
}

export const addApprenticeToUser = async (apprenticeEmail: string, selectedUserEmail: string) => {
    try {
        // Suche nach dem Benutzer
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Lehrling
        const apprentice = await User.findOne({
            email: apprenticeEmail,
        });

        if (!apprentice) {
            throw new Error('Lehrling nicht gefunden');
        }

        // Füge den Lehrling zum Benutzer hinzu
        const filter = { email: selectedUserEmail };

        const updateDoc = {
            $push: { apprentices: apprenticeEmail },
        };

        const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });

        console.log("Erfolgreich hinzugefügter Lehrling:", result);

        return true;

    } catch (error) {
        console.error('Fehler beim Hinzufügen des Lehrlings:', (error as unknown as string));
    }
}

export const removeApprenticeFromUser = async (apprenticeEmail: string, selectedUserEmail: string) => {
    try {
        // Suche nach dem Benutzer
        const currentSession = await getServerSession();

        const callingUser = await getUserByEmail(currentSession?.user?.email || '');

        if (!callingUser.user.isAdmin) {
            throw new Error('Nicht autorisiert');
        }

        // Suche nach dem Lehrling
        const apprentice = await User.findOne({
            email: apprenticeEmail,
        });

        if (!apprentice) {
            throw new Error('Lehrling nicht gefunden');
        }

        // Entferne den Lehrling vom Benutzer
        const filter = { email: selectedUserEmail };

        const updateDoc = {
            $pull: { apprentices: apprenticeEmail },
        };

        const result = await User.findOneAndUpdate(filter, updateDoc, { new: true });

        console.log("Erfolgreich entfernter Lehrling:", result);

        return true;

    } catch (error) {
        console.error('Fehler beim Entfernen des Lehrlings:', (error as unknown as string));
    }
}

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    try {
        // Suche nach dem Benutzer
        const user = await User.findOne({
            _id: userId,
        });

        if (!user) {
            throw new Error('Benutzer nicht gefunden');
        }

        // Überprüfe das alte Passwort
        const comparePasswords = await bcrypt.compare(oldPassword, user.password);

        if (!comparePasswords) {
            throw new Error('Falsches Passwort');
        }

        // Setze das neue Passwort
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;

        // Speichere die Änderungen am Benutzer
        await user.save();

        return true;

    } catch (error) {
        console.error('Fehler beim Ändern des Passworts:', (error as unknown as string));
        throw new Error('Fehler beim Ändern des Passworts');
    }
}