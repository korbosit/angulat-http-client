export class Task {
  constructor(
    public yiyle: string,
    public desc: string,
    public assignedTo: string,
    public createdAt: string,
    public priority: string,
    public status: string
  ) {}
}
