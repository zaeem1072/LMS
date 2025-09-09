class Api::V1::DashboardController < ApplicationController
  before_action :authenticate_user!

  

  def teacher_stats
    # byebug
    authorize! :read, :teacher_stats
    courses = current_user.courses
    course_ids = courses.pluck(:id)
    
    assignments = Assignment.where(course_id: course_ids)
    
    enrollments = Enrollment.where(course_id: course_ids)
    
    all_submissions = Submission.joins(:assignment).where(assignments: { course_id: course_ids })
    
    recent_courses = courses.order(created_at: :desc).limit(3)

    recent_submissions = Submission.joins(:assignment)
                                  .where(assignments: { course_id: course_ids })
                                  .order(created_at: :desc)
                                  .limit(5).includes(:user, assignment: :course)
                                  
    recent_enrollments = enrollments.order(created_at: :desc)
                                   .limit(5)
                                   .includes(:user, :course)

    stats = {
      total_courses: courses.count,
      total_assignments: assignments.count,
      total_students: enrollments.count,
      pending_submissions: all_submissions.count,
      recent_activity: {
        courses: recent_courses.map do |course|
          {
            id: course.id,
            title: course.title,
            created_at: course.created_at
          }
        end,
        submissions: recent_submissions.map do |submission|
          {
            id: submission.id,
            student_name: submission.user.email,
            assignment_title: submission.assignment.title,
            course_title: submission.assignment.course.title,
            created_at: submission.created_at
          }
        end,
        enrollments: recent_enrollments.map do |enrollment|
          {
            id: enrollment.id,
            student_name: enrollment.user.email,
            course_title: enrollment.course.title,
            created_at: enrollment.created_at
          }
        end
      }
    }

    render json: stats, status: :ok
  end

  # def teacher_students
  #   # byebug
  #   authorize! :read, :teacher_students
  #   courses = current_user.courses
  #   course_ids = courses.pluck(:id)
    
  #   enrollments = Enrollment.where(course_id: course_ids)
  #                          .includes(:user, :course)
  #                          .order(:created_at)

  #   students_by_course = enrollments.group_by(&:course)
    
  #   submission_counts = Submission.joins(:assignment)
  #                                .where(assignments: { course_id: course_ids })
  #                                .group(:user_id)
  #                                .count

  #   result = {
  #     total_students: enrollments.count,
  #     courses: students_by_course.map do |course, course_enrollments|
  #       {
  #         course_id: course.id,
  #         course_title: course.title,
  #         student_count: course_enrollments.count,
  #         students: course_enrollments.map do |enrollment|
  #           {
  #             id: enrollment.user.id,
  #             email: enrollment.user.email,
  #             enrolled_at: enrollment.created_at,
  #             submission_count: submission_counts[enrollment.user.id] || 0
  #           }
  #         end
  #       }
  #     end
  #   }

  #   render json: result, status: :ok
  # end

  def student_stats
    #  byebug
    authorize! :read, :student_stats

    enrollments = current_user.enrollments.includes(:course)
    enrolled_courses = enrollments.map(&:course)
    course_ids = enrolled_courses.pluck(:id)
    
    assignments = Assignment.where(course_id: course_ids)
    
    submissions = current_user.submissions.joins(:assignment)
                             .where(assignments: { course_id: course_ids })
                             .includes(:assignment)
    
    completed_assignment_ids = submissions.pluck(:assignment_id).uniq
    completed_assignments = completed_assignment_ids.count
    pending_assignments = assignments.count - completed_assignments
    pending_assignments = [pending_assignments, 0].max
    
    recent_enrollments = enrollments.order(created_at: :desc).limit(3)
    recent_submissions = submissions.order(created_at: :desc).limit(6)
    
    upcoming_assignments = assignments.where('due_date >= ? AND due_date <= ?', 
                                           Date.current, 
                                           7.days.from_now)
                                    .where.not(id: submissions.pluck(:assignment_id))
                                    .limit(5)

    stats = {
      total_courses: enrolled_courses.count,
      total_assignments: assignments.count,
      completed_assignments: completed_assignments,
      pending_assignments: pending_assignments,
      recent_activity: {
        enrollments: recent_enrollments.map do |enrollment|
          {
            id: enrollment.id,
            course_title: enrollment.course.title,
            enrolled_at: enrollment.created_at
          }
        end,
        submissions: recent_submissions.map do |submission|
          {
            id: submission.id,
            assignment_title: submission.assignment.title,
            course_title: submission.assignment.course.title,
            submitted_at: submission.created_at
          }
        end,
        upcoming_assignments: upcoming_assignments.map do |assignment|
          {
            id: assignment.id,
            title: assignment.title,
            course_title: assignment.course.title,
            due_date: assignment.due_date
          }
        end
      }
    }

    render json: stats, status: :ok
  end
end
