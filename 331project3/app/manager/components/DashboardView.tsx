"use client";

export default function DashboardView() {

    return (
        <>
            <style>
            {`
              @keyframes fade-in-up {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              @keyframes text-gradient {
                to {
                  background-position: 200% center;
                }
              }

              .animate-fade-in-up {
                animation: fade-in-up 1s ease-out forwards;
              }

              .bg-gradient-size-200 {
                background-size: 200% 200%;
              }

              .animate-text-gradient {
                animation: text-gradient 3s linear infinite;
              }
            `}
            </style>
            
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-4">
                <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
                    <h1 className="mt-2 text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text
                                 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 to-red-500
                                 animate-text-gradient bg-gradient-size-200
                                 pb-4">
                        Welcome to the Sharetea Manager Dashboard :D
                    </h1>
                </div>
            </div>
        </>
    )
}