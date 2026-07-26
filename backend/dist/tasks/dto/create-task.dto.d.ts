export declare class CreateTaskDto {
    timetableId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    repeatType: string;
    category?: string;
    order?: number;
}
