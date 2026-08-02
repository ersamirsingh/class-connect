import { UserModel, IUser } from '../user/user.model';
import { OrderModel } from '../payment/payment.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';
import { CourseModel } from '../course/course.model';
import { ReportModel } from '../report/report.model';

export class AdminService {
  // --- ADMIN MANAGEMENT ---
  static async getAdmins(): Promise<IUser[]> {
    return UserModel.find({ role: 'admin' }).sort({ createdAt: -1 });
  }

  static async createAdmin(payload: { name: string; email: string; password?: string; phone?: string }): Promise<IUser> {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new Error('An account with that email already exists.');
    }

    const admin = new UserModel({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password || 'Admin@123456',
      phone: payload.phone || '',
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    return admin;
  }

  static async deactivateAdmin(adminId: string): Promise<IUser> {
    const activeAdminCount = await UserModel.countDocuments({ role: 'admin', isActive: true });
    if (activeAdminCount <= 1) {
      throw new Error('System safeguard: Cannot deactivate the last remaining active admin account.');
    }

    const admin = await UserModel.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new Error('Admin account not found.');
    }

    admin.isActive = false;
    await admin.save();
    return admin;
  }

  // --- USER / STUDENT MANAGEMENT ---
  static async getStudents() {
    const students = await UserModel.find({ role: 'student' }).sort({ createdAt: -1 });
    const results = await Promise.all(
      students.map(async (student) => {
        const enrolledCount = await EnrollmentModel.countDocuments({ student: student._id, status: 'active' });
        return {
          ...student.toObject(),
          enrolledCount,
        };
      })
    );
    return results;
  }

  static async toggleUserStatus(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (user.role === 'admin') {
      // Use deactivateAdmin for admin safeguard checks
      return AdminService.deactivateAdmin(userId);
    }
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }

  // --- DASHBOARD STATS ---
  static async getDashboardStats() {
    const totalStudents = await UserModel.countDocuments({ role: 'student', isActive: true });
    const totalAdmins = await UserModel.countDocuments({ role: 'admin', isActive: true });
    const totalCourses = await CourseModel.countDocuments();
    const totalEnrollments = await EnrollmentModel.countDocuments({ status: 'active' });

    const successfulOrders = await OrderModel.find({ status: 'success' });
    const failedOrdersCount = await OrderModel.countDocuments({ status: 'failed' });

    const totalRevenue = successfulOrders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrdersCount = successfulOrders.length + failedOrdersCount;
    const successRate = totalOrdersCount > 0 ? Math.round((successfulOrders.length / totalOrdersCount) * 100) : 100;

    const openReportsCount = await ReportModel.countDocuments({ status: 'open' });

    // Chart mock monthly trend
    const chartData = [
      { month: 'Jan', revenue: 1200, enrollments: 40 },
      { month: 'Feb', revenue: 1900, enrollments: 65 },
      { month: 'Mar', revenue: 2400, enrollments: 85 },
      { month: 'Apr', revenue: 3100, enrollments: 110 },
      { month: 'May', revenue: 4200, enrollments: 150 },
      { month: 'Jun', revenue: totalRevenue > 5000 ? totalRevenue : 5400, enrollments: totalEnrollments > 0 ? totalEnrollments : 190 },
    ];

    return {
      totalStudents,
      totalAdmins,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      successRate,
      openReportsCount,
      chartData,
    };
  }

  // --- PAYMENT OVERSIGHT ---
  static async getAllOrders(statusFilter?: string) {
    const filter = statusFilter && statusFilter !== 'all' ? { status: statusFilter } : {};
    return OrderModel.find(filter)
      .populate('student', 'name email photo')
      .populate('course', 'title thumbnail price')
      .sort({ createdAt: -1 });
  }

  static async refundOrder(orderId: string) {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error('Order record not found.');

    order.status = 'failed';
    await order.save();

    // Revoke enrollment if active
    await EnrollmentModel.findOneAndUpdate(
      { student: order.student, course: order.course },
      { status: 'cancelled' }
    );

    return order;
  }

  static async getCourseEnrollments(courseId: string) {
    const enrollments = await EnrollmentModel.find({ course: courseId, status: 'active' })
      .populate('student', 'name email photo phone createdAt')
      .sort({ enrolledAt: -1 });
    return enrollments;
  }
}
