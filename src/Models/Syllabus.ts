import {User} from "./User";

export class Course{
  id: Number | undefined
  name: String | undefined
  credits: Number | undefined
  code: String | undefined
  control_type: String | undefined

  lecture_hours: Number | undefined
  practice_hours: Number | undefined
  sis_hours: Number | undefined
  tsis_hours: Number | undefined

}

export class Evaluation{
  id: Number | undefined
  name: String | undefined
  photo: String | undefined
}

export class Topic{
  id: Number | undefined
  name: String | undefined
  materials: String | undefined
  week: Number

  constructor(week: Number) {
    this.week = week
  }
}

export class Rubric{
  name: String | undefined
}

export class Approver{
  id: Number | undefined
  type: String | undefined
  user: User | undefined

  constructor(type: String) {
    this.type = type
  }
  getObjectToSerializer() {
    return {type: this.type, user: this.user?.id}
  }
}

export class Syllabus{
  id: Number = 0

  status: String | undefined
  language: String | undefined

  year: String | undefined
  course: Course | undefined
  teachers: Array<User> = [];

  purpose: String | undefined
  tasks: String | undefined
  results: String | undefined
  methods: String | undefined
  description: String | undefined
  resources: String | undefined
  policy: String | undefined

  pre_courses: Array<Course> = [];
  post_courses: Array<Course> = [];

  evaluation: Evaluation | undefined
  topics: Array<Topic> = [
    new Topic(1), new Topic(2), new Topic(3), new Topic(4), new Topic(5),
    new Topic(6), new Topic(7), new Topic(8), new Topic(9), new Topic(10)
  ];
  rubric: Rubric | undefined

  approvers: Array<Approver> = [new Approver('COORDINATOR'), new Approver('DEAN')]

  getJson(): string {
    return JSON.stringify({
      status: this.status,
      language: this.language,

      year: this.year,
      course: this.course?.id,
      teachers: this.teachers.map((t)=>t.id),

      purpose: this.purpose,
      tasks: this.tasks,
      results: this.results,
      methods: this.methods,
      description: this.description,
      resources: this.resources,
      policy: this.policy,

      pre_courses: this.pre_courses.map((p)=>p.id),
      post_courses: this.post_courses.map((p)=>p.id),

      evaluation: this.evaluation?.id,

      topics: this.topics,

      approvers: this.approvers.map((p)=>p.getObjectToSerializer())

    })
  }

}
