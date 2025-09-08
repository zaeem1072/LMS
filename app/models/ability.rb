class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user.present?

    case user.role
    when "admin"
      can :manage, :all  # Admins can do everything
      can :manage, User  # Can manage all users
      can :index, User   # Can see all users
      can :manage, :profile

    when "teacher"
      can :manage, Course, user_id: user.id
      can :manage, Assignment, course: { user_id: user.id }
      can :all_assignments, Assignment
      can :read, Submission, assignment: { course: { user_id: user.id } }
      can :read, Enrollment, course: { user_id: user.id }
      can :read, :teacher_stats
      can :read, :teacher_students
      can :manage, :profile
      can :index, User, role: ['teacher', 'student']

    when "student"
      can :read, Course
      can :manage, Enrollment, user_id: user.id
      can :read, Assignment do |assignment|
        assignment.course.enrollments.exists?(user_id: user.id)
      end
      can :my_assignments, Assignment
      can :manage, Submission, user_id: user.id
      can :create, Submission do |submission|
        submission.assignment.course.enrollments.exists?(user_id: user.id)
      end
      can :read, :student_stats
      can :manage, :profile

    when "mini_admin"
      can :read, Course
      can :read, Assignment
      can :read, Submission
      can :index, User, role: ["teacher", "student"]  # Can only see teachers and students
      can :show, User, role: ["teacher", "student"]
      can :create, User, role: ["teacher", "student"]
      can :update, User, role: ["teacher", "student"]
      can :destroy, User, role: ["teacher", "student"]
      can :manage, :profile
      
      # Mini-admins cannot access admins or other mini-admins
      cannot :read, User, role: ["admin", "mini_admin"]
      cannot :manage, User, role: ["admin", "mini_admin"]
    end
  end
end
