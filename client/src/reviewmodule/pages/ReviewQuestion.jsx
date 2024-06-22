import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { useToast, FormLabel, FormControl, Input, Button, chakra, Heading, IconButton, Box, Text } from '@chakra-ui/react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './ReviewQuestion.css'; // Import the CSS file
import getEnvironment from '../../getenvironment';

const apiUrl = getEnvironment();

const AddQuestion = () => {
  const editor = useRef(null);
  const [question, setQuestion] = useState('');
  const [type, setType] = useState('');
  const [options, setOptions] = useState(['']);
  const toast = useToast();
  const { eventId } = useParams(); 

  console.log('type is', type)

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setOptions(['']); 
  };

  const handleOptionChange = (index, newValue) => {
    const updatedOptions = options.map((option, i) => (i === index ? newValue : option));
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    // e.preventDefault(); // ^ put e here in the parameters to use this
    const newQuestion = {
      eventId,
    
      question: [question],
      show: true,
      type: [type],
      options: options.filter(option => option.trim() !== '') 
    };

    try {
      await axios.post(`${apiUrl}/reviewmodule/reviewQuestion/add`, newQuestion);
      toast({
        title: 'Question saved.',
        description: 'Your question has been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setQuestion('');
      setType('');
      setOptions(['']);
    } catch (error) {
      toast({
        title: 'Error saving question.',
        description: 'An error occurred while saving your question.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const HeaderReviewQuestion = ({ title }) => {
    const navigate = useNavigate();
    
    return (
      <Heading mr='1' ml='1' display='flex' >
        <IconButton
          mb='1'
          variant='ghost'
          onClick={() => navigate(-1)}
          _hover={{ bgColor: 'transparent' }}
        >
          <chakra.svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='white'
            className='w-6 h-6'
            _hover={{ stroke: '#00BFFF' }}
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </chakra.svg>
        </IconButton>
        <chakra.div marginInline='auto' color="white" fontSize='25px' mt='2' >
          {title}
        </chakra.div>
      </Heading>
    );
  };

  return (
    <div 
    className="add-question-page">
        <Box  bg="black" p={0.2} width='80%'>
          <HeaderReviewQuestion color="white" textAlign="center" title={'Add Review Question'+(type?' - '+type:'')}/>
        </Box>
        <br/>
      <FormControl onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
        <Box bg={'#48835d'} style={{fontWeight:'500', opacity:'100%',borderTopLeftRadius:'5px',borderTopRightRadius:'5px'}} p={2}>
          <Text color="white" textAlign={'center'}>Question</Text>
        </Box>
          <JoditEditor
            ref={editor}
            value={question}
            onChange={(newContent) => setQuestion(newContent)}
          />
        </div>
        <div className="form-group">
          {/* <FormLabel>Type</FormLabel> */}
          <Box bg={'#48835d'} style={{fontWeight:'500', opacity:'100%',borderTopLeftRadius:'5px',borderTopRightRadius:'5px'}} p={2}>
          <Text color="white" textAlign={'center'}>Type</Text>
        </Box>
          <select value={type} onChange={handleTypeChange} id='typeSelector'>
            <option value="">Select Type</option>
            <option value="Single Correct">Single Correct</option>
            <option value="Multiple Correct">Multiple Correct</option>
            <option value="Text">Text</option>
          </select>
        </div>
        {(type === 'Single Correct' || type === 'Multiple Correct') && (
          <div className="form-group">
            {/* <FormLabel>Options:</FormLabel> */}
            <Box bg={'#48835d'} style={{fontWeight:'500', opacity:'100%',borderTopLeftRadius:'5px',borderTopRightRadius:'5px'}} p={2}>
              <Text color="white" textAlign={'center'}>Options</Text>
            </Box>
            {options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type={type === 'Single Correct' ? "radio" : "checkbox"}
                  name={type === 'Single Correct' ? "singleCorrectOption" : `multipleCorrectOption${index}`}
                  disabled
                />
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {options.length > 1 && (
                  <Button type="button" colorScheme='red' onClick={() => handleRemoveOption(index)}>Remove</Button>
                )}
              </div>
            ))}
            <Button type="button" colorScheme='green' onClick={handleAddOption}>Add Option</Button>
          </div>
        )}
        {(!type)?'':(
          <Link
            onClick={handleSubmit}
            className="tw-m-auto tw-px-8 tw-text-white tw-bg-gradient-to-r tw-from-cyan-600 tw-to-cyan-500 hover:tw-bg-gradient-to-bl focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-cyan-300 dark:focus:tw-ring-cyan-800 tw-font-bold tw-rounded-lg tw-text-sm tw-px-5 tw-py-2.5 tw-text-center"
            >Save Question</Link>
          )} 
      </FormControl>
    </div>
  );
};

export default AddQuestion;
