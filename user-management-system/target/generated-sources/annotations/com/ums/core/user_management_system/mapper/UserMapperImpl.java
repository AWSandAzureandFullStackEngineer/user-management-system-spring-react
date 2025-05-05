package com.ums.core.user_management_system.mapper;

import com.ums.core.user_management_system.dto.UserRequestDTO;
import com.ums.core.user_management_system.dto.UserResponseDTO;
import com.ums.core.user_management_system.entity.User;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-05T04:56:44-0500",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.3 (Amazon.com Inc.)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserRequestDTO userRequestDTO) {
        if ( userRequestDTO == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( userRequestDTO.getEmail() );
        user.username( userRequestDTO.getUsername() );
        user.firstName( userRequestDTO.getFirstName() );
        user.lastName( userRequestDTO.getLastName() );

        return user.build();
    }

    @Override
    public UserResponseDTO toUserResponseDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponseDTO.UserResponseDTOBuilder userResponseDTO = UserResponseDTO.builder();

        userResponseDTO.id( user.getId() );
        userResponseDTO.username( user.getUsername() );
        userResponseDTO.email( user.getEmail() );
        userResponseDTO.firstName( user.getFirstName() );
        userResponseDTO.lastName( user.getLastName() );
        userResponseDTO.phoneNumber( user.getPhoneNumber() );
        userResponseDTO.active( user.isActive() );
        userResponseDTO.createdAt( user.getCreatedAt() );
        userResponseDTO.updatedAt( user.getUpdatedAt() );

        return userResponseDTO.build();
    }

    @Override
    public List<UserResponseDTO> toUserResponseDTOList(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserResponseDTO> list = new ArrayList<UserResponseDTO>( users.size() );
        for ( User user : users ) {
            list.add( toUserResponseDTO( user ) );
        }

        return list;
    }

    @Override
    public void updateUserFromDto(UserRequestDTO userRequestDTO, User user) {
        if ( userRequestDTO == null ) {
            return;
        }

        user.setEmail( userRequestDTO.getEmail() );
        user.setUsername( userRequestDTO.getUsername() );
        user.setFirstName( userRequestDTO.getFirstName() );
        user.setLastName( userRequestDTO.getLastName() );
    }
}
