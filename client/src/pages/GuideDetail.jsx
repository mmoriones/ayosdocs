import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FullGuide from '../layouts/FullGuide';

const GuideDetail = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      const res = await axios.get(`http://localhost:5000/api/guides/${slug}`);
      setGuide(res.data);
    };
    fetchGuide();
  }, [slug]);

  if (!guide) return <div className="p-10 text-center">Loading...</div>;

  return (
    <FullGuide 
      title={guide.title} 
      lastUpdated={guide.lastUpdated}
      guideName={guide.title}
      checklistSteps={guide.checklist}
    >
      <div dangerouslySetInnerHTML={{ __html: guide.content }} />
    </FullGuide>
  );
};

export default GuideDetail;