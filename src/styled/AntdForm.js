import React from 'react';
import {
  Form, Icon, Tooltip,
} from 'antd';
import { StyledButton } from '../styled';

class AntdForm extends React.Component{
  
  handleSubmit = e => {
    debugger;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll( ( err, values ) => {
      
      if( !err ){
        this.props.onSubmit( values );
      }
    } );
  };
  
  getCamelCase = ( name ) => {
    let camelCase = name.split( ' ' );
    for( let i = 0; i < camelCase.length; i++ ){
      camelCase[ i ] = camelCase[ i ].toLowerCase();
      if( i > 0 ){
        camelCase[ i ] = camelCase[ i ].charAt( 0 ).toUpperCase() +
          camelCase[ i ].slice( 1 );
      }
    }
    camelCase = camelCase.join( '' );
    
    return camelCase;
    
  };
  
  
  getRules = ( type, required = true ) => {
    const rules = [];
    
    if( type === 'email' ){
      rules.push( { type: 'email', message: 'Please enter a valid E-mail.' } );
    }else if( type === 'url' ){
      rules.push( { type: 'url', message: 'Please enter a valid url.' } );
    }
    
    if( required ){
      rules.push( { required: true, message: 'This field is required.' } );
    }
    
    return rules;
    
  };
  
  renderChildren = ( children ) => {
    
    const childrenToReturn = children.map( child => {
      
      if( Array.isArray( child ) ){
        return this.renderChildren( child );
      }
      
      if( child.type && child.type.name &&
        ( child.type.name === 'AntdInput' || 'AntdSelect' ) ){
        
        const camelCase = this.getCamelCase( child.props.name );
        const required = !child.props.notRequired;
        const rules = this.getRules( child.props.type, required );
        let label = child.props.label ? child.props.label : child.props.name;
        if( child.props.tooltipTitle ){
          label = <Tooltip title={ child.props.tooltipTitle }>
            <span>{ child.props.label ? child.props.label :
              child.props.name }</span>
          </Tooltip>;
        }
        return ( <Form.Item
          label={ label }>
          { this.props.form.getFieldDecorator( camelCase, { rules } )( child ) }
        </Form.Item> );
      }
      return child;
      
    } );
    return childrenToReturn;
  };
  
  render(){
    
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 }, sm: { span: 5 },
      }, wrapperCol: {
        xs: { span: 24 }, sm: { span: 12 },
      },
    };
    
    return ( <Form { ...formItemLayout }
                   onSubmit={ this.handleSubmit }
                   hideRequiredMark>
      { this.renderChildren( this.props.children ) }
      <StyledButton onClick={ this.handleSubmit }
                    type={ 'submit' }>Submit</StyledButton>
    </Form> );
  }
}

export const WrappedAntdForm = Form.create( { name: 'register' } )( AntdForm );