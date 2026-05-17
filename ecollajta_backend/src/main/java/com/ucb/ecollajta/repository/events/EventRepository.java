package com.ucb.ecollajta.repository.events;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;

import com.ucb.ecollajta.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    
}
