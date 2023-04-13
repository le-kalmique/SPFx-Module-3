import * as React from 'react';
export interface IProps {
  image: string;
  title?: string;
}

export const ImageField: React.FC<IProps> = ({ image, title }) => {

  const date = new Date(image);
  const dayOfWeek = date.getDay();

  const getDayOfWeek = (day: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  console.log('customizer', image);

  return (
    <div>
      {title} released on date: {image} {getDayOfWeek(dayOfWeek)}

    </div>
  );
};