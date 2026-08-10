interface ProgressCardProps{
    title: string;
    current: number;
    total:number;
    label:string;
}

export default function ProgressCard({title,current,total,label}:ProgressCardProps){
    return(
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="mt-6 text-3xl font-bold">
                {current} / {total}
            </p>

            <p className="text-gray-500">{label}</p>
        </div>
    );
}